import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Token } from '@/types/token';
import { getTokenData } from '@/lib/api';

const REFRESH_INTERVAL = 15; // seconds
const WALLET_ADDRESS = "7jZj1fiUZXUQ3sKQcopbDnWZYAPkEu28Su32WCRoEfQn";

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
  const [sortedMintAddresses, setSortedMintAddresses] = useState<string[]>([]);

  // Fetch fresh token data
  const fetchTokenData = useCallback(async () => {
    try {
      const data = await getTokenData(WALLET_ADDRESS);
      setTokens(data);
      
      // Initialize mint address order if not set
      if (sortedMintAddresses.length === 0 && data.length > 0) {
        setSortedMintAddresses(data.map(token => token.mintAddress));
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch token data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sortedMintAddresses]);

  // Initial data fetch
  useEffect(() => {
    fetchTokenData();
  }, [fetchTokenData]);

  // Refresh countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          fetchTokenData();
          return REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchTokenData]);

  // Prepare chart data maintaining consistent order
  const chartData: BarData[] = sortedMintAddresses.map(mintAddress => {
    const token = tokens.find(t => t.mintAddress === mintAddress);
    if (!token) return {
      projectName: 'Unknown',
      mintAddress,
      balance: 0,
      maxBalance: 0
    };

    const maxWallets = token.metadata[0].tokenDescription.tokenData["Maximum Number of Wallets Allowed"];
    const tokensPerWallet = token.metadata[0].tokenDescription.tokenData["Number of Tokens per Wallet"];
    const projectName = token.metadata[0].tokenDescription.tokenData["Project Name"];

    return {
      projectName,
      mintAddress,
      balance: token.balance,
      maxBalance: maxWallets * tokensPerWallet
    };
  });

  if (loading) {
    return <div className="animate-pulse bg-[#1B1B1B] h-[300px] rounded-lg"></div>;
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
        <div className="h-[400px]"> {/* Increased height to accommodate multiple bars */}
          {error ? (
            <div className="h-full flex items-center justify-center text-red-500">
              {error}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
              >
                <XAxis type="number" stroke="#B4B4B4" />
                <YAxis
                  type="category"
                  dataKey="projectName"
                  stroke="#B4B4B4"
                  width={140}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1B1B1B",
                    border: "1px solid #2D2D2D",
                    borderRadius: "4px",
                  }}
                  formatter={(value: number) => value.toLocaleString()}
                />
                <Legend />
                <Bar
                  dataKey="balance"
                  name="Current Balance"
                  fill="#4FDEE5"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="maxBalance"
                  name="Maximum Balance"
                  fill="#2D2D2D"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
