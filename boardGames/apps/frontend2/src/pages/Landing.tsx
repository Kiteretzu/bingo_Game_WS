import ProfileDashboard from '../components/ProfileDashboard';
import GameHistory from '../components/GameHistory';
import Leaderboard from '../components/Leaderboard';
import HowToPlay from '../components/HowToPlay';
import DeveloperMessage from '../components/DeveloperMessage';
import FindMatchButton from '../components/buttons/FindMatchButton';
import "@/components/test.css";

export default function Dashboard() {
    return (
        <div className="min-h-screen animate-gradient-flow text-white ">
            <div className="grid p-6 grid-cols-3 grid-rows-6 gap-4 h-screen">
                {/* First row */}
                <div className="col-span-1 row-span-1 flex">
                    <div className='grow'>
                        <ProfileDashboard />
                    </div>
                 
                </div>
                <div className="col-span-1 row-span-3">
                    <GameHistory />
                </div>
                <div className="col-span-1 row-span-6">
                    <Leaderboard />
                </div>

                {/* Second row */}
                <div className="col-span-1 row-span-5">
                    <HowToPlay />
                </div>
                <div className="col-span-1 row-span-2">
                    <DeveloperMessage />
                </div>

                {/* Third row */}
                <div className="col-span-1 flex justify-center border items-center row-span-1">
                    <FindMatchButton />
                </div>
            </div>
        </div>
    );
}

