import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Token } from '@/types/token';
import { getTokenData } from '@/lib/api';

const REFRESH_INTERVAL = 15; // seconds
const WALLET_ADDRESS = "7jZj1fiUZXUQ3sKQcopbDnWZYAPkEu28Su32WCRoEfQn";

export default function TokenMonitor() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate current and maximum balance for the selected token
  const getBalanceData = () => {
    const token = tokens.find(t => t.mintAddress === selectedToken);
    if (!token) return { current: 0, max: 0 };

    const maxWallets = token.metadata[0].tokenDescription.tokenData["Maximum Number of Wallets Allowed"];
    const tokensPerWallet = token.metadata[0].tokenDescription.tokenData["Number of Tokens per Wallet"];
    const maxBalance = maxWallets * tokensPerWallet;

    return {
      current: token.balance,
      max: maxBalance
    };
  };

  // Fetch fresh token data
  const fetchTokenData = useCallback(async () => {
      try {
        const data = await getTokenData(WALLET_ADDRESS);
        setTokens(data);
        if (!selectedToken && data.length > 0) {
          setSelectedToken(data[0].mintAddress);
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch token data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, [selectedToken]);

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

  // Prepare chart data
  const balanceData = getBalanceData();
  const chartData = [
    {
      name: 'Current Balance',
      value: balanceData.current,
      max: balanceData.max
    }
  ];

  if (loading) {
    return <div className="animate-pulse bg-[#1B1B1B] h-[300px] rounded-lg"></div>;
  }

  return (
    <Card className="bg-[#1B1B1B] border-[#2D2D2D]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#4FDEE5] text-xl">Token Monitor</CardTitle>
        <div className="flex items-center gap-4">
          <span className="text-[#B4B4B4] text-sm">
            Refresh in: <span className="text-[#4FDEE5]">{countdown}s</span>
          </span>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger className="w-[200px] bg-[#1B1B1B] border-[#2D2D2D] text-[#F1F1F3]">
              <SelectValue placeholder="Select a token" />
            </SelectTrigger>
            <SelectContent className="bg-[#1B1B1B] border-[#2D2D2D] text-[#F1F1F3]">
              {tokens.map((token) => (
                <SelectItem
                  key={token.mintAddress}
                  value={token.mintAddress}
                  className="hover:bg-[#2D2D2D] hover:text-[#4FDEE5] cursor-pointer"
                >
                  {token.metadata[0].tokenDescription.tokenData["Project Name"]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          {error ? (
            <div className="h-full flex items-center justify-center text-red-500">
              {error}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#B4B4B4" />
                <YAxis 
                  stroke="#B4B4B4" 
                  domain={[0, balanceData.max]} 
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1B1B1B",
                    border: "1px solid #2D2D2D",
                    borderRadius: "4px",
                  }}
                  formatter={(value: number) => value.toLocaleString()}
                />
                <Bar
                  dataKey="value"
                  fill="#4FDEE5"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
