"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Inter, Montserrat } from "next/font/google";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XAxis, YAxis, Tooltip, CartesianGrid, Legend, Area } from "recharts";

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

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

type ProjectData = {
  date: string;
  inCirculation: number;
  consumed: number;
  newTokens: number;
  returnedTokens: number;
};

type ProjectsDataType = {
  [key: string]: ProjectData[];
};

// Sample data for multiple projects
const projectsData: ProjectsDataType = {
  "Project A": [
    {
      date: "2023-01",
      inCirculation: 1000,
      consumed: 0,
      newTokens: 1000,
      returnedTokens: 0,
    },
    {
      date: "2023-02",
      inCirculation: 950,
      consumed: 50,
      newTokens: 0,
      returnedTokens: 50,
    },
    {
      date: "2023-03",
      inCirculation: 850,
      consumed: 150,
      newTokens: 50,
      returnedTokens: 100,
    },
    {
      date: "2023-04",
      inCirculation: 700,
      consumed: 300,
      newTokens: 0,
      returnedTokens: 150,
    },
    {
      date: "2023-05",
      inCirculation: 500,
      consumed: 500,
      newTokens: 100,
      returnedTokens: 200,
    },
    {
      date: "2023-06",
      inCirculation: 250,
      consumed: 750,
      newTokens: 0,
      returnedTokens: 250,
    },
    {
      date: "2023-07",
      inCirculation: 100,
      consumed: 900,
      newTokens: 50,
      returnedTokens: 200,
    },
  ],
  "Project B": [
    {
      date: "2023-01",
      inCirculation: 500,
      consumed: 0,
      newTokens: 500,
      returnedTokens: 0,
    },
    {
      date: "2023-02",
      inCirculation: 450,
      consumed: 50,
      newTokens: 0,
      returnedTokens: 25,
    },
    {
      date: "2023-03",
      inCirculation: 400,
      consumed: 100,
      newTokens: 25,
      returnedTokens: 50,
    },
    {
      date: "2023-04",
      inCirculation: 350,
      consumed: 150,
      newTokens: 0,
      returnedTokens: 75,
    },
    {
      date: "2023-05",
      inCirculation: 250,
      consumed: 250,
      newTokens: 50,
      returnedTokens: 100,
    },
    {
      date: "2023-06",
      inCirculation: 150,
      consumed: 350,
      newTokens: 0,
      returnedTokens: 125,
    },
    {
      date: "2023-07",
      inCirculation: 50,
      consumed: 450,
      newTokens: 25,
      returnedTokens: 100,
    },
  ],
  "Project C": [
    {
      date: "2023-01",
      inCirculation: 200,
      consumed: 0,
      newTokens: 200,
      returnedTokens: 0,
    },
    {
      date: "2023-02",
      inCirculation: 180,
      consumed: 20,
      newTokens: 0,
      returnedTokens: 10,
    },
    {
      date: "2023-03",
      inCirculation: 160,
      consumed: 40,
      newTokens: 10,
      returnedTokens: 20,
    },
    {
      date: "2023-04",
      inCirculation: 140,
      consumed: 60,
      newTokens: 0,
      returnedTokens: 30,
    },
    {
      date: "2023-05",
      inCirculation: 100,
      consumed: 100,
      newTokens: 20,
      returnedTokens: 40,
    },
    {
      date: "2023-06",
      inCirculation: 60,
      consumed: 140,
      newTokens: 0,
      returnedTokens: 50,
    },
    {
      date: "2023-07",
      inCirculation: 20,
      consumed: 180,
      newTokens: 10,
      returnedTokens: 40,
    },
  ],
};

export default function Dashboard() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("Project A");

  const currentProjectData = useMemo(
    () => projectsData[selectedProject],
    [selectedProject]
  );
  const totalTokens = useMemo(
    () => currentProjectData[0].inCirculation + currentProjectData[0].consumed,
    [currentProjectData]
  );
  const tokensInCirculation = useMemo(
    () => currentProjectData[currentProjectData.length - 1].inCirculation,
    [currentProjectData]
  );
  const tokensConsumed = useMemo(
    () => currentProjectData[currentProjectData.length - 1].consumed,
    [currentProjectData]
  );

  return (
    <div
      className={`min-h-screen bg-[#0E0E0E] text-[#F1F1F3] ${inter.className}`}
    >
      <nav className="bg-[#1B1B1B] p-4 flex justify-between items-center">
        <h1
          className={`text-2xl font-bold text-[#4FDEE5] ${montserrat.className}`}
        >
          Smart Supply System
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="md:hidden text-[#4FDEE5]"
        >
          {isNavOpen ? <X /> : <Menu />}
        </Button>
        <ul className={`md:flex space-x-6 ${isNavOpen ? "block" : "hidden"}`}>
          <li>
            <a
              href="#"
              className="hover:text-[#4FDEE5] text-sm font-medium tracking-wide"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-[#4FDEE5] text-sm font-medium tracking-wide"
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-[#4FDEE5] text-sm font-medium tracking-wide"
            >
              Analytics
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-[#4FDEE5] text-sm font-medium tracking-wide"
            >
              Settings
            </a>
          </li>
        </ul>
      </nav>

      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[200px] bg-[#1B1B1B] border-[#2D2D2D] text-[#F1F1F3]">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent className="bg-[#1B1B1B] border-[#2D2D2D] text-[#F1F1F3]">
              {Object.keys(projectsData).map((project) => (
                <SelectItem
                  key={project}
                  value={project}
                  className="hover:bg-[#2D2D2D] hover:text-[#4FDEE5] cursor-pointer"
                >
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card className="bg-[#1B1B1B] border-[#2D2D2D]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={`text-[#4FDEE5] text-xl ${montserrat.className}`}
              >
                Total Tokens
              </CardTitle>
              <Coins className="h-8 w-8 text-[#4FDEE5]" />{" "}
              {/* Increased size */}
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#F1F1F3]">
                {totalTokens}
              </div>
              <p className="text-xs text-[#B4B4B4]">All time</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1B1B1B] border-[#2D2D2D]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={`text-[#4FDEE5] text-xl ${montserrat.className}`}
              >
                Tokens in Circulation
              </CardTitle>
              <CircleDollarSign className="h-8 w-8 text-[#4FDEE5]" />{" "}
              {/* Increased size */}
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#F1F1F3]">
                {tokensInCirculation}
              </div>
              <p className="text-xs text-[#B4B4B4]">Current</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1B1B1B] border-[#2D2D2D]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={`text-[#4FDEE5] text-xl ${montserrat.className}`}
              >
                Tokens Consumed
              </CardTitle>
              <BarChart3 className="h-8 w-8 text-[#4FDEE5]" />{" "}
              {/* Increased size */}
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#F1F1F3]">
                {tokensConsumed}
              </div>
              <p className="text-xs text-[#B4B4B4]">All time</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-10 bg-[#1B1B1B] border-[#2D2D2D]">
          <CardHeader>
            <CardTitle
              className={`text-[#4FDEE5] text-2xl ${montserrat.className}`}
            >
              Token Circulation vs Consumption
            </CardTitle>
            <CardDescription className="text-[#B4B4B4] text-sm">
              Overview of token distribution over time for {selectedProject}
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
                    stackId="1"
                    stroke="#4FDEE5"
                    fill="#4FDEE5"
                    fillOpacity={0.2}
                    name="In Circulation"
                  />
                  <Area
                    type="monotone"
                    dataKey="consumed"
                    stackId="1"
                    stroke="#F1F1F3"
                    fill="#F1F1F3"
                    fillOpacity={0.2}
                    name="Consumed"
                  />
                  <Area
                    type="monotone"
                    dataKey="newTokens"
                    stackId="2"
                    stroke="#FFB528"
                    fill="#FFB528"
                    fillOpacity={0.2}
                    name="New Tokens"
                  />
                  <Area
                    type="monotone"
                    dataKey="returnedTokens"
                    stackId="2"
                    stroke="#FF6B6B"
                    fill="#FF6B6B"
                    fillOpacity={0.2}
                    name="Returned Tokens"
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
