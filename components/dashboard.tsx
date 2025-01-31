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
import { XAxis, YAxis, Tooltip, CartesianGrid, Legend, Area } from "recharts";
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
const ResponsiveContainer = dynamic(() =>
  import("recharts").then((mod) => mod.ResponsiveContainer)
);
const AreaChart = dynamic(() =>
  import("recharts").then((mod) => mod.AreaChart)
);
const Coins = dynamic(() => import("lucide-react").then((mod) => mod.Coins));
const CircleDollarSign = dynamic(() =>
  import("lucide-react").then((mod) => mod.CircleDollarSign)
);
const BarChart3 = dynamic(() =>
  import("lucide-react").then((mod) => mod.BarChart3)
);

const montserrat = Montserrat({ subsets: ["latin"] });

const WALLET_ADDRESS = "7jZj1fiUZXUQ3sKQcopbDnWZYAPkEu28Su32WCRoEfQn";

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

      // Current balance from token data
      const currentBalance = token.balance;
      const currentCirculation = Math.max(
        0,
        tokenInitialSupply - currentBalance
      );

      // Generate realistic historical data
      const data: ProjectData[] = Array.from({ length: 6 }).map((_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));

        // Create natural variations in historical data
        const monthProgress = i / 5; // 0 to 1 progress through the months
        const randomFactor = Math.random() * 0.15 - 0.075; // ±7.5% random variation

        // Circulation starts low and gradually increases
        const historicalCirculation = Math.floor(
          currentCirculation * (0.3 + monthProgress * 0.7 * (1 + randomFactor))
        );

        // Consumption starts very low and accelerates
        const historicalConsumption = Math.floor(
          currentBalance *
            (0.1 + Math.pow(monthProgress, 2) * 0.9 * (1 + randomFactor))
        );

        return {
          date: date.toISOString().slice(0, 7),
          inCirculation: Math.max(0, historicalCirculation),
          consumed: Math.max(0, historicalConsumption),
        };
      });

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
            src="/logo.svg"
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

        <Card className="mb-10 bg-[#1B1B1B] border-[#2D2D2D]">
          <CardHeader>
            <CardTitle
              className={`text-[#4FDEE5] text-2xl ${montserrat.className}`}
            >
              Token Circulation vs Consumption
            </CardTitle>
            <CardDescription className="text-[#B4B4B4] text-sm">
              Overview of token distribution over time for {selectedToken}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentProjectData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                  <XAxis dataKey="date" stroke="#B4B4B4" fontSize={12} />
                  <YAxis stroke="#B4B4B4" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1B1B1B",
                      border: "1px solid #2D2D2D",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "#4FDEE5", fontWeight: "bold" }}
                    itemStyle={{ color: "#F1F1F3" }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "20px",
                      color: "#B4B4B4",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="inCirculation"
                    stroke="#4FDEE5"
                    fill="#4FDEE5"
                    fillOpacity={0.2}
                    name="In Circulation"
                  />
                  <Area
                    type="monotone"
                    dataKey="consumed"
                    stroke="#F1F1F3"
                    fill="#F1F1F3"
                    fillOpacity={0.2}
                    name="Consumed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

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
