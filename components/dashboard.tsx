"use client";
import dynamic from "next/dynamic";
import { Montserrat } from "next/font/google";
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

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#141414]">
      <nav className="flex items-center px-6 py-4 bg-[#1B1B1B] border-b border-[#2D2D2D]">
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
      </nav>

      <div className="flex-1 overflow-y-auto p-8">
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
