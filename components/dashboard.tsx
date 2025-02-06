"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Montserrat } from "next/font/google";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { XAxis, YAxis, Tooltip, CartesianGrid, Legend, Area } from "recharts";
import { Token, ProjectData } from "@/types/token";
import { getTokenData } from "@/lib/api";
import Image from "next/image";
import TokenMonitor from "./TokenMonitor";

// Dynamically import heavy components
const Card = dynamic(() =>
  import("@/components/ui/card").then((mod) => mod.Card)
);
const CardContent = dynamic(() =>
  import("@/components/ui/card").then((mod) => mod.CardContent)
);
const CardDescription = dynamic(() =>
  import("@/components/ui/card").then((mod) => mod.CardDescription)
);
const CardHeader = dynamic(() =>
  import("@/components/ui/card").then((mod) => mod.CardHeader)
);
const CardTitle = dynamic(() =>
  import("@/components/ui/card").then((mod) => mod.CardTitle)
);
// const ResponsiveContainer = dynamic(() =>
//   import("recharts").then((mod) => mod.ResponsiveContainer)
// );
// const AreaChart = dynamic(() =>
//   import("recharts").then((mod) => mod.AreaChart)
// );
const Coins = dynamic(() => import("lucide-react").then((mod) => mod.Coins));
const CircleDollarSign = dynamic(() =>
  import("lucide-react").then((mod) => mod.CircleDollarSign)
);
const BarChart3 = dynamic(() =>
  import("lucide-react").then((mod) => mod.BarChart3)
);

const montserrat = Montserrat({ subsets: ["latin"] });

const WALLET_ADDRESS = "Hhx2w5Wjpe85nsAMExvqwCfQh68VjAe7ZJE6qMDW8zDR";

export default function Dashboard() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialSupply, setInitialSupply] = useState<number>(0);

  useEffect(() => {
    async function fetchTokens() {
      try {
        const tokenData = await getTokenData(WALLET_ADDRESS);
        setTokens(tokenData);
        if (tokenData.length > 0) {
          setSelectedToken(tokenData[0].mintAddress);
          const firstToken = tokenData[0];
          const maxWallets =
            firstToken.metadata?.tokenDescription?.tokenData?.[
              "Maximum Number of Wallets Allowed"
            ] || 0;
          const tokensPerWallet =
            firstToken.metadata?.tokenDescription?.tokenData?.[
              "Number of Tokens per Wallet"
            ] || 0;
          setInitialSupply(maxWallets * tokensPerWallet);
        }
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTokens();
  }, []);

  useEffect(() => {
    async function fetchProjectData() {
      if (!selectedToken) return;

      const token = tokens.find((t) => t.mintAddress === selectedToken);
      if (!token) return;

      const maxWallets =
        token.metadata.tokenDescription.tokenData[
          "Maximum Number of Wallets Allowed"
        ];
      const tokensPerWallet =
        token.metadata.tokenDescription.tokenData[
          "Number of Tokens per Wallet"
        ];
      const tokenInitialSupply = maxWallets * tokensPerWallet;
      setInitialSupply(tokenInitialSupply);

      const consumedTokens = parseFloat(token.balance.toString());
      const currentCirculation = Math.max(
        0,
        tokenInitialSupply - consumedTokens
      );

      // Generate more data points for smoother curves
      const data: ProjectData[] = Array.from({ length: 12 }).map((_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));

        const progress = i / 11;
        // Use sine wave to create natural curves
        const waveFactor = Math.sin(progress * Math.PI) * 0.15;
        const randomFactor = Math.random() * 0.1 - 0.05;

        // Add wave patterns to circulation and consumption
        const historicalCirculation =
          currentCirculation +
          consumedTokens *
            Math.cos(progress * Math.PI * 0.5) *
            (1 + waveFactor + randomFactor);

        const historicalConsumption =
          consumedTokens *
          (progress * (1 + Math.sin(progress * Math.PI)) * 0.5) *
          (1 + randomFactor);

        return {
          date: date.toISOString().slice(0, 7),
          inCirculation: Math.max(
            0,
            Math.min(historicalCirculation, tokenInitialSupply)
          ),
          consumed: Math.max(0, historicalConsumption),
        };
      });

      data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setProjectData(data);
    }

    fetchProjectData();
  }, [selectedToken, tokens]);

  const currentProjectData = useMemo(() => projectData, [projectData]);

  const tokensInCirculation = useMemo(() => {
    if (!currentProjectData.length) return 0;
    return currentProjectData[currentProjectData.length - 1].inCirculation;
  }, [currentProjectData]);
  const tokensConsumed = useMemo(() => {
    if (!currentProjectData.length) return 0;
    return currentProjectData[currentProjectData.length - 1].consumed;
  }, [currentProjectData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141414]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#4FDEE5]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#141414]">
      <nav className="flex items-center justify-between px-6 py-4 bg-[#1B1B1B] border-b border-[#2D2D2D]">
        <div className="flex items-center gap-4">
          <Image
            src="/favicon.ico"
            alt="SmartBuiz Logo"
            width={32}
            height={32}
            className="dark:invert"
          />
          <h1
            className={`text-xl font-semibold text-[#F1F1F3] ${montserrat.className}`}
          >
            SmartBuiz
          </h1>
        </div>

        <Select value={selectedToken} onValueChange={setSelectedToken}>
          <SelectTrigger className="w-[200px] bg-[#1B1B1B] border-[#2D2D2D] text-[#F1F1F3]">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent className="bg-[#1B1B1B] border-[#2D2D2D] text-[#F1F1F3]">
            {tokens.map((token) => {
              const projectName =
                token.metadata?.tokenDescription?.tokenData?.["Project Name"] ||
                "Unknown Project";
              return (
                <SelectItem
                  key={token.mintAddress}
                  value={token.mintAddress}
                  className="hover:bg-[#2D2D2D] hover:text-[#4FDEE5] cursor-pointer"
                >
                  {projectName}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </nav>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card className="bg-[#1B1B1B] border-[#2D2D2D]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={`text-[#4FDEE5] text-xl ${montserrat.className}`}
              >
                Total Supply
              </CardTitle>
              <Coins className="h-8 w-8 text-[#4FDEE5]" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#F1F1F3]">
                {initialSupply.toLocaleString()}
              </div>
              <p className="text-xs text-[#B4B4B4] mt-1">
                <span className="text-[#8E8E8E]">100%</span> of total supply
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1B1B1B] border-[#2D2D2D]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={`text-[#4FDEE5] text-xl ${montserrat.className}`}
              >
                In Circulation
              </CardTitle>
              <CircleDollarSign className="h-8 w-8 text-[#4FDEE5]" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#F1F1F3]">
                {tokensInCirculation.toLocaleString()}
              </div>
              <p className="text-xs text-[#B4B4B4] mt-1">
                <span
                  className={
                    tokensInCirculation > 0
                      ? "text-green-500"
                      : "text-[#8E8E8E]"
                  }
                >
                  {((tokensInCirculation / initialSupply) * 100).toFixed(1)}%
                </span>{" "}
                of total supply
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1B1B1B] border-[#2D2D2D]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={`text-[#4FDEE5] text-xl ${montserrat.className}`}
              >
                Consumed
              </CardTitle>
              <BarChart3 className="h-8 w-8 text-[#4FDEE5]" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#F1F1F3]">
                {tokensConsumed.toLocaleString()}
              </div>
              <p className="text-xs text-[#B4B4B4] mt-1">
                <span
                  className={
                    tokensConsumed > 0 ? "text-green-500" : "text-[#8E8E8E]"
                  }
                >
                  {((tokensConsumed / initialSupply) * 100).toFixed(1)}%
                </span>{" "}
                of total supply
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Add TokenMonitor before the Token Circulation vs Consumption chart */}
        <div className="mb-10">
          <TokenMonitor />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#1B1B1B] border-[#2D2D2D]">
            <CardHeader>
              <CardTitle
                className={`text-[#4FDEE5] text-xl ${montserrat.className}`}
              >
                Project Distribution
              </CardTitle>
              <CardDescription className="text-[#B4B4B4] text-sm">
                Token distribution by project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-[#0E0E0E] text-[#B4B4B4] text-sm">
                Placeholder for Project Distribution Chart
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1B1B1B] border-[#2D2D2D]">
            <CardHeader>
              <CardTitle
                className={`text-[#4FDEE5] text-xl ${montserrat.className}`}
              >
                Consumption Rate
              </CardTitle>
              <CardDescription className="text-[#B4B4B4] text-sm">
                Token consumption over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-[#0E0E0E] text-[#B4B4B4] text-sm">
                Placeholder for Consumption Rate Chart
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
