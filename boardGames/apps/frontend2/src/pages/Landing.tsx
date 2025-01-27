import ProfileDashboard from '../components/ProfileDashboard';
import GameHistory from '../components/GameHistory';
import Leaderboard from '../components/Leaderboard';
import HowToPlay from '../components/HowToPlay';
import DeveloperMessage from '../components/DeveloperMessage';
import "@/components/test.css";
import useBingo from '@/hooks/useBingo';
import MatchFoundScreen from '@/components/dialog/matchFound-dialog';
import FriendList from '@/components/FriendList';
import FindMatch from '@/components/FindMatch';

export default function Dashboard() {
    const { isMatchFound } = useBingo()

    return (
        <div className="min-h-screen min-w-full flex text-white">
            <div className="grid p-4 md:p-6 grow-0 min-w-[1280px] overflow-auto animate-gradient-flow grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-6 gap-4 h-screen">
                {/* First row */}
                <div className="col-span-1 row-span-1 flex">
                    <div className="flex-1 min-w-0 h-full">
                        <ProfileDashboard />
                    </div>
                </div>
                <div className="col-span-1 row-span-3 h-full">
                    <GameHistory />
                </div>
                <div className="col-span-1 row-span-6 h-full">
                    <Leaderboard />
                </div>

                {/* Second row */}
                <div className="col-span-1 row-span-2 h-full">
                    <HowToPlay />
                </div>
                <div className="col-span-1 row-span-3 h-full">
                    <FriendList />
                </div>
                <div className="col-span-1 row-span-2 h-full">
                    <DeveloperMessage />
                </div>

                {/* Third row */}
                {isMatchFound && <MatchFoundScreen />}
                <FindMatch />
            </div>
        </div>
    );
}