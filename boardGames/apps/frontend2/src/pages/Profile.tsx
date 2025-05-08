"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Settings } from "lucide-react"

// Sample match dataq
const matches = [
    {
        date: "3/5/2021",
        time: "1:49 AM",
        hero: "Magnus",
        heroIcon:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ui-profileDashBoard-xsJVRdaYJvVq9cQseDIEF3FFBUG8YG.png",
        result: "Win",
        duration: "36:24",
        type: "Unranked",
    },
    {
        date: "3/5/2021",
        time: "1:01 AM",
        hero: "Enchantress",
        heroIcon:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ui-profileDashBoard-xsJVRdaYJvVq9cQseDIEF3FFBUG8YG.png",
        result: "Loss",
        duration: "41:33",
        type: "Unranked",
    },
    // Add more matches as needed...
]

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="container mx-auto p-4">
                {/* Navigation Tabs */}
                <Tabs defaultValue="profile" className="mb-6">
                    <TabsList className="bg-gray-800/50 backdrop-blur">
                        <TabsTrigger value="profile" className="text-gray-200">
                            PROFILE
                        </TabsTrigger>
                        <TabsTrigger value="stats" className="text-gray-200">
                            STATS
                        </TabsTrigger>
                        <TabsTrigger value="teammates" className="text-gray-200">
                            TEAMMATES
                        </TabsTrigger>
                        <TabsTrigger value="trophies" className="text-gray-200">
                            TROPHIES
                        </TabsTrigger>
                        <TabsTrigger value="tickets" className="text-gray-200">
                            TICKETS
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
                            <CardContent className="p-4">
                                <div className="relative">
                                    <img
                                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ui-profileDashBoard-xsJVRdaYJvVq9cQseDIEF3FFBUG8YG.png"
                                        alt="Profile"
                                        className="w-full aspect-square rounded-lg object-cover mb-4"
                                    />
                                    <div className="absolute bottom-6 left-4">
                                        <h2 className="text-2xl font-bold text-white">ALPHR</h2>
                                        <p className="text-sm text-gray-400">MAIN MENU</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-400 text-sm">
                                    <span className="mr-2">FRIEND ID:</span>
                                    <span>1177094306</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats Pentagon */}
                        <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
                            <CardContent className="p-4">
                                <h3 className="text-sm font-medium text-gray-400 mb-2">MOST RECENT 20 GAME(S)</h3>
                                <div className="aspect-square relative">
                                    {/* This is a placeholder for the pentagon chart */}
                                    <div className="absolute inset-0 bg-orange-500/20 clip-pentagon"></div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Match History */}
                    <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-medium text-gray-400">ALL RECENT MATCHES</h3>
                                <Settings className="w-5 h-5 text-gray-400" />
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-700">
                                        <TableHead className="text-gray-400">DATE / TIME</TableHead>
                                        <TableHead className="text-gray-400">HERO PLAYED</TableHead>
                                        <TableHead className="text-gray-400">RESULT</TableHead>
                                        <TableHead className="text-gray-400">DURATION</TableHead>
                                        <TableHead className="text-gray-400">TYPE</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {matches.map((match, index) => (
                                        <TableRow key={index} className="border-gray-700">
                                            <TableCell className="text-gray-300">
                                                <div>{match.date}</div>
                                                <div className="text-gray-500">{match.time}</div>
                                            </TableCell>
                                            <TableCell className="text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={match.heroIcon || "/placeholder.svg"}
                                                        alt={match.hero}
                                                        className="w-8 h-8 rounded"
                                                    />
                                                    {match.hero}
                                                </div>
                                            </TableCell>
                                            <TableCell className={match.result === "Win" ? "text-green-500" : "text-red-500"}>
                                                {match.result}
                                            </TableCell>
                                            <TableCell className="text-gray-300">{match.duration}</TableCell>
                                            <TableCell className="text-gray-300">{match.type}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

