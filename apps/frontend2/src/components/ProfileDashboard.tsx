import clsx from "clsx";
import { useAppSelector } from "@/store/hooks";
import { Avatar, AvatarImage } from "./ui/avatar";
import LogoutButton from "./buttons/LogoutButton";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Copy as CopyIcon } from "lucide-react";
import { toast } from "react-toastify";
import { defaultToastConfig } from "@/utils/toastConfig";

export default function ProfileDashboard() {
  // State for tracking if the user is logged in
  const isLoggedIn = useAppSelector((state) => state.profile.isAuth);
  const profileData = useAppSelector((state) => state.profile);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/auth/google"; // backend url
  };

  // Sample badges data - replace with actual data from your state when available
  const badges = [
    { id: 1, name: "First Win", icon: "🏆", earned: true },
    { id: 2, name: "Streak", icon: "🔥", earned: true },
    { id: 3, name: "Champion", icon: "👑", earned: false },
    { id: 4, name: "Pro", icon: "⭐", earned: false },
  ];

  return (
    <div
      className={clsx(
        "bg-gray-800 w-full h-full flex flex-col border border-gray-500/25 p-1 px-3 py-4 rounded-lg  shadow-lg relative",
        {
          "cursor-pointer hover:scale-105 duration-200": isLoggedIn, // Hover effect is applied only if logged in
          "cursor-default": !isLoggedIn, // Disable pointer cursor when not logged in
        }
      )}
    >
      {/* Conditional rendering based on login status */}
      {isLoggedIn ? (
        <>
          {/* Profile Section for logged-in user */}
          <div className="flex items-start ">
            <div className="bg-gray-700 rounded-full flex items-start justify-start mr-4">
              <Avatar className="w-14 h-14">
                <AvatarImage src={profileData.avatar} alt="profile" />
              </Avatar>
            </div>
            <div className="flex-grow p-1 ">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg max:w-[23ch] truncate xl:text-2xl font-bold text-gray-100">
                  {profileData?.displayName
                    ? profileData.displayName.length > 20
                      ? profileData.displayName.slice(0, 20) + "..."
                      : profileData.displayName
                    : "Guest"}
                </h3>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          profileData?.googleId ?? "Guest"
                        );
                        toast.success(
                          "Copied to clipboard!",
                          defaultToastConfig
                        );
                      }}
                    >
                      <CopyIcon className="w-4 h-4" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent
                    side="right"
                    className="p-3 bg-gray-800 border-gray-500/25 text-white w-auto"
                  >
                    <span className="text-sm font-jaro">
                      {profileData?.googleId}
                    </span>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="mt-1 flex items-center space-x-3 xl:space-x-3">
                {/* Matches */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-base xl:text-lg font-light xl:font-medium">
                    Matches:
                  </span>
                  <span className="text-base xl:text-xl font-semibold text-yellow-400">
                    {profileData.bingoProfile?.totalMatches ?? 0}
                  </span>
                </div>
                {/* Wins */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-base xl:text-lg font-light xl:font-medium">
                    Wins:
                  </span>
                  <span className="text-base xl:text-xl font-semibold text-green-500">
                    {profileData.bingoProfile?.wins ?? 0}
                  </span>
                </div>
                {/* Losses */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-base xl:text-lg font-light xl:font-medium">
                    Losses:
                  </span>
                  <span className="text-base xl:text-xl font-semibold text-red-500">
                    {profileData.bingoProfile?.losses ?? 0}
                  </span>
                </div>
              </div>
            </div>
            <LogoutButton />
          </div>

          {/* Badges Section mainly 2 BADGES! */}
          <div className="flex-1 mt-2 justify-center items-center flex ">
            <HoverCard>
              <HoverCardTrigger asChild>
                <img
                  src="/badges/silverBadge.png"
                  className="w-12 h-12"
                  alt="badge"
                />
              </HoverCardTrigger>
              <HoverCardContent className=" bg-gray-800 border-gray-500/25 text-white">
                <span>Silver Badge: Awarded for something special!</span>
              </HoverCardContent>
            </HoverCard>
            <HoverCard>
              <HoverCardTrigger asChild>
                <img
                  src="/badges/questionBadge.png"
                  className="w-12 h-12"
                  alt="badge"
                />
              </HoverCardTrigger>
              <HoverCardContent className=" bg-gray-800 border-gray-500/25 text-white">
                <span>Question Badge: Unlock to reveal its secret!</span>
              </HoverCardContent>
            </HoverCard>
          </div>
        </>
      ) : (
        // Button for logging in with Google if not logged in
        <div className="flex justify-center items-center space-x-4 h-full">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center bg-blue-600 text-white p-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            <img
              src="https://icon2.cleanpng.com/20181108/wls/kisspng-youtube-google-logo-google-images-google-account-consulting-crm-the-1-recommended-crm-for-g-suite-1713925039962.webp"
              className="w-6 h-6 mr-3"
              alt="Google Logo"
            />
            <span className="font-semibold text-lg">Login with Google</span>
          </button>
        </div>
      )}
    </div>
  );
}
