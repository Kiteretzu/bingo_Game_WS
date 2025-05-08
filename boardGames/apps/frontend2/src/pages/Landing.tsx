import ProfileDashboard from "../components/ProfileDashboard";
import GameHistory from "../components/GameHistory";
import Leaderboard from "../components/Leaderboard";
import HowToPlay from "../components/HowToPlay";
import DeveloperMessage from "../components/DeveloperMessage";
import "@/components/test.css";
import useBingo from "@/hooks/useBingo";
import MatchFoundScreen from "@/components/dialog/matchFound-dialog";
import FriendList from "@/components/FriendList";
import FindMatch from "@/components/FindMatch";
import { ExpandableCard } from "@/components/Expandable-cards";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { isConfirmedMatch } = useBingo();
  const [rowHeight, setRowHeight] = useState(0);

  // Calculate row height on client-side only
  useEffect(() => {
    const calculateRowHeight = () => {
      const height = window.visualViewport
        ? window.visualViewport.height / 6
        : window.innerHeight / 6;
      setRowHeight(height);
    };

    calculateRowHeight();
    window.addEventListener("resize", calculateRowHeight);

    return () => window.removeEventListener("resize", calculateRowHeight);
  }, []);

  return (
    <div className="text-white w-full ">
      <div
        className="grid p-4 md:p-6 gap-4 mx-auto pb-20 animate-gradient-flow grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-x-auto"
        style={{
          gridTemplateRows: rowHeight ? `repeat(6, ${rowHeight}px)` : "auto",
        }}
      >
        {/* First row */}
        <div className="col-span-1 row-span-1 flex min-h-full">
          <div className="flex-1 w-full min-w-0 z-20 min-h-full">
            <ProfileDashboard />
          </div>
        </div>
        <div className="col-span-1 row-span-3">
          <GameHistory />
        </div>
        <div className="col-span-1 row-span-6">
          <Leaderboard />
        </div>

        <div className="col-span-1 row-span-2">
          <ExpandableCard
            item={<HowToPlay />}
            renderItem={(item) => item}
            expandedMaxHeight="max-h-[90vh]"
            maxWidth="max-w-[800px]"
          />
        </div>
        <div className="col-span-1 row-span-3">
          <FriendList />
        </div>
        <div className="col-span-1 row-span-2">
          <ExpandableCard
            item={<DeveloperMessage />}
            renderItem={(item) => item}
            expandedMaxHeight="max-h-[90vh]"
            maxWidth="max-w-[800px]"
          />
        </div>

        {/* Match found screen */}
        {isConfirmedMatch && <MatchFoundScreen />}

        {/* Fixed FindMatch component */}
        <div className="fixed z-30 bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 md:w-auto max-w-full">
          <FindMatch />
        </div>
      </div>
    </div>
  );
}
