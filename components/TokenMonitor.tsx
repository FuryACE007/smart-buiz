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
const WALLET_ADDRESS = "Hhx2w5Wjpe85nsAMExvqwCfQh68VjAe7ZJE6qMDW8zDR";

// Color array for token bars
const TOKEN_COLORS = [
  "#4FDEE5", // Cyan
  "#FF6B6B", // Coral Red
  "#48BF84", // Green
  "#FFB347", // Orange
  "#9B6DFF", // Purple
  "#FF69B4", // Hot Pink
  "#4DA6FF", // Blue
  "#FFD700", // Gold
  "#98FB98", // Pale Green
  "#DDA0DD", // Plum
];

interface BarData {
  projectName: string;
  mintAddress: string;
  balance: number;
  maxBalance: number;
  color?: string;
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
    (mintAddress, index) => {
      const token = tokens.find((t) => t.mintAddress === mintAddress);
      if (!token)
        return {
          projectName: "Unknown",
          mintAddress,
          balance: 0,
          maxBalance: 0,
          color: TOKEN_COLORS[index % TOKEN_COLORS.length],
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
        color: TOKEN_COLORS[index % TOKEN_COLORS.length],
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
        <div className="h-[800px]">
          {error ? (
            <div className="h-full flex items-center justify-center text-red-500">
              {error}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 120, left: 20, bottom: 20 }}
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
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <YAxis
                  type="category"
                  dataKey="projectName"
                  stroke="#B4B4B4"
                  width={200}
                  tick={{ fontSize: 14 }}
                  interval={0}
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
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="balance"
                  name="Current Balance"
                  fill={chartData[0]?.color || TOKEN_COLORS[0]}
                  radius={[0, 4, 4, 0]}
                  barSize={10}
                />
                <Bar
                  dataKey="maxBalance"
                  name="Maximum Balance"
                  fill="#6B7280"
                  radius={[0, 4, 4, 0]}
                  barSize={10}
                  label={{
                    position: "right",
                    fill: "#B4B4B4",
                    fontSize: 12,
                    formatter: (value: number) =>
                      `Max: ${value.toLocaleString()}`,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
