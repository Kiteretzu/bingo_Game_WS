// src/pages/Profile.tsx
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, X, Check } from "lucide-react";
import PentagonStatCard from "@/components/globals/profile/PentagonStatCard";
import useBingo from "@/hooks/useBingo";
import { useGetGameHistoryQuery } from "@repo/graphql/types/client";
import BackgroundUploader from "@/components/globals/profile/BackgroundUploader";

// Preset background options
const presetBackgrounds = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1542779283-429940ce8336?w=1920&q=80",
    name: "Purple Galaxy",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    name: "Mountain Vista",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80",
    name: "Neon City",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1465146633011-14f8e0781093?w=1920&q=80",
    name: "Aurora",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80",
    name: "Night Sky",
  },
];

// Simple Navbar component
const Navbar = () => (
  <nav className="bg-gray-900/50 backdrop-blur-md border-b border-gray-700 p-4">
    <div className="container mx-auto flex items-center justify-between">
      <h1 className="text-xl font-bold text-white">Gaming Profile</h1>
      <div className="flex gap-4">
        <button className="text-gray-300 hover:text-white transition">
          Home
        </button>
        <button className="text-gray-300 hover:text-white transition">
          Profile
        </button>
        <button className="text-gray-300 hover:text-white transition">
          Stats
        </button>
      </div>
    </div>
  </nav>
);

export default function ProfilePage() {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasNewBackground, setHasNewBackground] = useState(false);
  const [previousBackground, setPreviousBackground] = useState("");

  const selectPreset = (url: string) => {
    setBackgroundImage(url);
    setHasNewBackground(true);
  };

  const resetBackground = () => {
    setBackgroundImage("");
  };

  const handleApplyBackground = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
    setHasNewBackground(true);
  };

  const handleCancelUpload = () => {
    // No additional state to clear here since preview is managed in BackgroundUploader
  };

  const handleSettingsClick = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 300);
    setShowDropdown((prev) => !prev);
  };

  const { bingoProfileId, isAuth } = useBingo();

  const { data: gameHistory, loading } = useGetGameHistoryQuery({
    variables: {
      bingoProfileId: bingoProfileId,
      limit: 10,
    },
    skip: !isAuth,
    fetchPolicy: "cache-and-network",
  });

  // Assuming `gameHistory` is from your GraphQL query result
  const formattedMatches =
    gameHistory?.gameHistory?.map((game) => {
      // Convert timestamps to readable date/time
      const createdAt = new Date(Number(game.createdAt));
      const endedAt = game.gameEndedAt
        ? new Date(Number(game.gameEndedAt))
        : null;

      // Calculate duration in mm:ss format
      let duration = "—";
      if (endedAt) {
        const diffMs = endedAt.getTime() - createdAt.getTime();
        const minutes = Math.floor(diffMs / 60000);
        const seconds = Math.floor((diffMs % 60000) / 1000);
        duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
      }

      // Determine result based on your player’s ID (replace with actual one)
      const myPlayerId = "a6a9b042-5899-43eb-87be-38a4f3444852";
      let result = "";
      if (game?.gameWinnerId === myPlayerId) result = "Win";
      else if (game?.gameLoserId === myPlayerId) result = "Loss";
      else result = "Pending";

      return {
        date: createdAt.toLocaleDateString(),
        time: createdAt.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        gameType: game?.winMethod || "—",
        result,
        duration,
        tier: game?.tier || "—",
      };
    }) ?? [];

  console.log("gameHistory", gameHistory);

  const handleSaveBackground = () => {
    setHasNewBackground(false);
    setShowCustomizer(false);
    setPreviousBackground(backgroundImage);
  };

  const handleCancelBackground = () => {
    setBackgroundImage(previousBackground);
    setHasNewBackground(false);
    setShowCustomizer(false);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay for better readability when background image is set */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      )}

      <div className="relative z-10">
        <Navbar />

        {/* Customizer Modal */}
        {showCustomizer && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Customize Background
                </h2>
                <button
                  onClick={() => setShowCustomizer(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Upload Section */}
              <BackgroundUploader
                onApply={handleApplyBackground}
                onCancel={handleCancelUpload}
              />

              {/* Preset Backgrounds */}
              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-3">
                  Preset Backgrounds
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {presetBackgrounds.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => selectPreset(bg.url)}
                      className="relative group rounded-lg overflow-hidden h-32 hover:ring-2 hover:ring-orange-500 transition"
                    >
                      <img
                        src={bg.url}
                        alt={bg.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                        <span className="text-white text-sm font-medium">
                          {bg.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={resetBackground}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="container mx-auto p-6">
          <div className="bg-gradient-to-tr from-gray-900/80 to-gray-800/80 backdrop-blur-md rounded-xl p-6">
            {/* Navigation Tabs */}
            <Tabs defaultValue="profile" className="mb-6">
              <TabsList className="bg-gray-800/50 backdrop-blur">
                <TabsTrigger value="profile" className="text-gray-200">
                  PROFILE
                </TabsTrigger>
                <TabsTrigger value="stats" className="text-gray-200">
                  RECORDS
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Profile Card */}
                <Card className="bg-gray-800/70 backdrop-blur border-gray-700">
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
                <PentagonStatCard />
              </div>

              {/* Right Column - Match History */}
              <Card className="bg-gray-800/70 backdrop-blur border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-400">
                      ALL RECENT MATCHES
                    </h3>
                    <div className="relative">
                      <button
                        onClick={handleSettingsClick}
                        className={`transition-transform duration-700 ${isSpinning ? "animate-spin" : ""}`}
                      >
                        <Settings className="w-5 h-5 text-gray-400 cursor-pointer" />
                      </button>
                      {showDropdown && (
                        <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                          <ul className="text-sm text-gray-300">
                            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                              Refresh Data
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                              Export CSV
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                              Filter Matches
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-gray-400 text-left p-3 font-medium text-sm">
                            DATE / TIME
                          </th>
                          <th className="text-gray-400 text-left p-3 font-medium text-sm">
                            GAME TYPE
                          </th>
                          <th className="text-gray-400 text-left p-3 font-medium text-sm">
                            RESULT
                          </th>
                          <th className="text-gray-400 text-left p-3 font-medium text-sm">
                            DURATION
                          </th>
                          <th className="text-gray-400 text-left p-3 font-medium text-sm">
                            TIER
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formattedMatches.map((match, index) => (
                          <tr key={index} className="border-b border-gray-700">
                            <td className="text-gray-300 p-3">
                              <div>{match.date}</div>
                              <div className="text-gray-500 text-sm">
                                {match.time}
                              </div>
                            </td>
                            <td className="text-gray-300 p-3">
                              {match.gameType}
                            </td>
                            <td
                              className={`p-3 ${
                                match.result === "Win"
                                  ? "text-green-500"
                                  : match.result === "Loss"
                                    ? "text-red-500"
                                    : "text-gray-400"
                              }`}
                            >
                              {match.result}
                            </td>
                            <td className="text-gray-300 p-3">
                              {match.duration}
                            </td>
                            <td className="text-gray-300 p-3">{match.tier}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Customize Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setPreviousBackground(backgroundImage);
                  setShowCustomizer(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <Settings className="w-4 h-4" />
                Customize Background
              </button>
              {hasNewBackground && (
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveBackground}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelBackground}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
