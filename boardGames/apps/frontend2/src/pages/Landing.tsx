import ProfileDashboard from '../components/ProfileDashboard';
import GameHistory from '../components/GameHistory';
import Leaderboard from '../components/Leaderboard';
import HowToPlay from '../components/HowToPlay';
import DeveloperMessage from '../components/DeveloperMessage';
import FindMatchButton from '../components/buttons/FindMatchButton';
import "@/components/test.css";
import useBingo from '@/hooks/useBingo';
import { useAppSelector } from '@/store/hooks';
import MatchFoundScreen from '@/components/models/match-found-model';

export default function Dashboard() {
    const { findMatch, cancelFindMatch, isFinding } = useBingo()
    const name = useAppSelector(state => state.profile.displayName) as string
    return (
        <div className="min-h-screen  animate-gradient-flow text-white ">
            <div className="grid p-6 grid-cols-3 grid-rows-6 gap-4 h-screen max-h-screen">
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
                {/* <MatchFoundScreen /> */}
                <div className="col-span-1 flex justify-center items-center row-span-1">
                    <FindMatchButton findMatch={() => findMatch()} cancelFindMatch={cancelFindMatch} isFinding={isFinding} />
                </div>
            </div>
        </div>
    );
}

