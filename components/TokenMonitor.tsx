import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Token } from "@/types/token";
import { getTokenData } from "@/lib/api";

const REFRESH_INTERVAL = 15; // seconds
const WALLET_ADDRESS = "BKQQ5ypcHe4vAJa4XfydJGawoNmgovCe9BH95qZfD4nM";

interface BarData {
  projectName: string;
  mintAddress: string;
  balance: number;
  maxBalance: number;
}

export default function TokenMonitor() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sortedMintAddressesRef = useRef<string[]>([]);

  const fetchTokenData = useCallback(async () => {
    try {
      const data = await getTokenData(WALLET_ADDRESS);
      setTokens(data);

      if (sortedMintAddressesRef.current.length === 0 && data.length > 0) {
        sortedMintAddressesRef.current = data.map((token) => token.mintAddress);
      }

      setError(null);
    } catch (err) {
      setError("Failed to fetch token data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokenData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchTokenData();
          return REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const chartData: BarData[] = sortedMintAddressesRef.current.map(
    (mintAddress) => {
      const token = tokens.find((t) => t.mintAddress === mintAddress);
      if (!token)
        return {
          projectName: "Unknown",
          mintAddress,
          balance: 0,
          maxBalance: 0,
        };

      const maxWallets =
        token.metadata.tokenDescription.tokenData[
          "Maximum Number of Wallets Allowed"
        ] || 0;
      const tokensPerWallet =
        token.metadata.tokenDescription.tokenData[
          "Number of Tokens per Wallet"
        ] || 0;
      const projectName =
        token.metadata.tokenDescription.tokenData["Project Name"] ||
        "Unknown Project";

      return {
        projectName,
        mintAddress,
        balance: token.balance,
        maxBalance: maxWallets * tokensPerWallet,
      };
    }
  );

  if (loading) {
    return (
      <div className="animate-pulse bg-[#1B1B1B] h-[300px] rounded-lg"></div>
    );
  }

  return (
    <Card className="bg-[#1B1B1B] border-[#2D2D2D]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#4FDEE5] text-xl">Token Monitor</CardTitle>
        <span className="text-[#B4B4B4] text-sm">
          Refresh in: <span className="text-[#4FDEE5]">{countdown}s</span>
        </span>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {error ? (
            <div className="h-full flex items-center justify-center text-red-500">
              {error}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                style={{
                  backgroundColor: "rgba(27, 27, 27, 0.8)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "8px",
                }}
              >
                <XAxis
                  type="number"
                  stroke="#B4B4B4"
                  scale="log"
                  domain={[1, "auto"]}
                />
                <YAxis
                  type="category"
                  dataKey="projectName"
                  stroke="#B4B4B4"
                  width={140}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(27, 27, 27, 0.8)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(79, 222, 229, 0.2)",
                    boxShadow:
                      "0 4px 12px rgba(0, 0, 0, 0.1), 0 0 1px rgba(79, 222, 229, 0.1)",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    color: "#F1F1F3",
                  }}
                  cursor={{ fill: "rgba(27, 27, 27, 0.4)" }}
                  formatter={(value: number) => value.toLocaleString()}
                />
                <Legend />
                <Bar
                  dataKey="balance"
                  name="Current Balance"
                  fill="#4FDEE5"
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="maxBalance"
                  name="Maximum Balance"
                  fill="#6B7280"
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
