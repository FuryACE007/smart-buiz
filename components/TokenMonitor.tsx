import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Token } from '@/types/token';

const REFRESH_INTERVAL = 15; // seconds

interface TokenMonitorProps {
  tokens: Token[];
  selectedToken: string;
  onTokenSelect: (tokenId: string) => void;
}

export default function TokenMonitor({ tokens, selectedToken, onTokenSelect }: TokenMonitorProps) {
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [currentBalance, setCurrentBalance] = useState(0);

  // Helper function to find current token's balance
  const getCurrentBalance = useCallback(() => {
    const token = tokens.find(t => t.mintAddress === selectedToken);
    return token?.balance || 0;
  }, [tokens, selectedToken]);

  // Update balance when selected token changes
  useEffect(() => {
    setCurrentBalance(getCurrentBalance());
  }, [selectedToken, tokens, getCurrentBalance]);

  // Countdown and refresh logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Refresh balance here
          setCurrentBalance(getCurrentBalance());
          return REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedToken, tokens, getCurrentBalance]);

  // Prepare chart data
  const chartData = [
    {
      name: 'Current Balance',
      value: currentBalance
    }
  ];

  return (
    <Card className="bg-[#1B1B1B] border-[#2D2D2D]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#4FDEE5] text-xl">Token Monitor</CardTitle>
        <div className="flex items-center gap-4">
          <span className="text-[#B4B4B4] text-sm">
            Refresh in: <span className="text-[#4FDEE5]">{countdown}s</span>
          </span>
          <Select value={selectedToken} onValueChange={onTokenSelect}>
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#B4B4B4" />
              <YAxis stroke="#B4B4B4" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1B1B1B",
                  border: "1px solid #2D2D2D",
                  borderRadius: "4px",
                }}
              />
              <Bar
                dataKey="value"
                fill="#4FDEE5"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
