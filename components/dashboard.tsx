"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Inter, Montserrat } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const montserrat = Montserrat({ subsets: ['latin'] })

// Updated sample data
const tokenData = [
  { date: "2023-01", inCirculation: 1000, consumed: 0, newTokens: 1000, returnedTokens: 0 },
  { date: "2023-02", inCirculation: 950, consumed: 50, newTokens: 0, returnedTokens: 50 },
  { date: "2023-03", inCirculation: 850, consumed: 150, newTokens: 50, returnedTokens: 100 },
  { date: "2023-04", inCirculation: 700, consumed: 300, newTokens: 0, returnedTokens: 150 },
  { date: "2023-05", inCirculation: 500, consumed: 500, newTokens: 100, returnedTokens: 200 },
  { date: "2023-06", inCirculation: 250, consumed: 750, newTokens: 0, returnedTokens: 250 },
  { date: "2023-07", inCirculation: 100, consumed: 900, newTokens: 50, returnedTokens: 200 },
]

export function DashboardComponent() {
  const [isNavOpen, setIsNavOpen] = useState(false)

  return (
    <div className={`min-h-screen bg-[#0E0E0E] text-[#F1F1F3] ${inter.className}`}>
      <nav className="bg-[#1B1B1B] p-4 flex justify-between items-center">
        <h1 className={`text-2xl font-bold text-[#4FDEE5] ${montserrat.className}`}>Smart Supply System</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="md:hidden text-[#4FDEE5]"
        >
          {isNavOpen ? <X /> : <Menu />}
        </Button>
        <ul className={`md:flex space-x-6 ${isNavOpen ? 'block' : 'hidden'}`}>
          <li><a href="#" className="hover:text-[#4FDEE5] text-sm font-medium tracking-wide">Dashboard</a></li>
          <li><a href="#" className="hover:text-[#4FDEE5] text-sm font-medium tracking-wide">Projects</a></li>
          <li><a href="#" className="hover:text-[#4FDEE5] text-sm font-medium tracking-wide">Analytics</a></li>
          <li><a href="#" className="hover:text-[#4FDEE5] text-sm font-medium tracking-wide">Settings</a></li>
        </ul>
      </nav>
      
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card className="bg-[#1B1B1B] border-[#2D2D2D]">
            <CardHeader>
              <CardTitle className={`text-[#4FDEE5] text-xl ${montserrat.className}`}>Total Tokens</CardTitle>
              <CardDescription className="text-[#B4B4B4] text-sm">All time</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`text-4xl font-bold text-[#F1F1F3] ${montserrat.className}`}>1,000</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1B1B1B] border-[#2D2D2D]">
            <CardHeader>
              <CardTitle className={`text-[#4FDEE5] text-xl ${montserrat.className}`}>Tokens in Circulation</CardTitle>
              <CardDescription className="text-[#B4B4B4] text-sm">Current</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`text-4xl font-bold text-[#F1F1F3] ${montserrat.className}`}>100</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1B1B1B] border-[#2D2D2D]">
            <CardHeader>
              <CardTitle className={`text-[#4FDEE5] text-xl ${montserrat.className}`}>Tokens Consumed</CardTitle>
              <CardDescription className="text-[#B4B4B4] text-sm">All time</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`text-4xl font-bold text-[#F1F1F3] ${montserrat.className}`}>900</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-10 bg-[#1B1B1B] border-[#2D2D2D]">
          <CardHeader>
            <CardTitle className={`text-[#4FDEE5] text-2xl ${montserrat.className}`}>Token Circulation vs Consumption</CardTitle>
            <CardDescription className="text-[#B4B4B4] text-sm">Overview of token distribution over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tokenData}>
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
                  <Area type="monotone" dataKey="inCirculation" stackId="1" stroke="#4FDEE5" fill="#4FDEE5" fillOpacity={0.2} name="In Circulation" />
                  <Area type="monotone" dataKey="consumed" stackId="1" stroke="#F1F1F3" fill="#F1F1F3" fillOpacity={0.2} name="Consumed" />
                  <Area type="monotone" dataKey="newTokens" stackId="2" stroke="#FFB528" fill="#FFB528" fillOpacity={0.2} name="New Tokens" />
                  <Area type="monotone" dataKey="returnedTokens" stackId="2" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity={0.2} name="Returned Tokens" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#1B1B1B] border-[#2D2D2D]">
            <CardHeader>
              <CardTitle className={`text-[#4FDEE5] text-xl ${montserrat.className}`}>Project Distribution</CardTitle>
              <CardDescription className="text-[#B4B4B4] text-sm">Token distribution by project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-[#0E0E0E] text-[#B4B4B4] text-sm">
                Placeholder for Project Distribution Chart
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1B1B1B] border-[#2D2D2D]">
            <CardHeader>
              <CardTitle className={`text-[#4FDEE5] text-xl ${montserrat.className}`}>Consumption Rate</CardTitle>
              <CardDescription className="text-[#B4B4B4] text-sm">Token consumption over time</CardDescription>
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
  )
}