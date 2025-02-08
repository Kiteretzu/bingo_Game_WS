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
import { ExpandableCard } from '@/components/Expandable-cards';


export default function Dashboard() {
    const { isConfirmedMatch } = useBingo();

    const rowHeight = window.visualViewport ? window.visualViewport.height / 6 : window.innerHeight / 6;

    return (
        <div className=" text-white">
            <div
                className="grid  p-4 md:p-6 grow-0 min-w-[1280px] overflow-hidden animate-gradient-flow grid-cols-3 gap-4"
                style={{ gridTemplateRows: `repeat(6, ${rowHeight}px)` }}
            >
                {/* First row */}
                <div className="col-span-1 row-span-1 shrink-0 flex min-h-full">
                    <div className="flex-1 shrink-0 min-w-0 min-h-full">
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
                        renderItem={(item, isExpanded) => item}
                        maxHeight="h-full"
                        expandedMaxHeight="max-h-[90vh]"
                        maxWidth='max-w-[800px]'
                    />
                </div>
                <div className="col-span-1 row-span-3">
                    <FriendList />
                </div>
                <div className="col-span-1 row-span-2">
                    <ExpandableCard
                        item={<DeveloperMessage />}
                        renderItem={(item, isExpanded) => item}
                        // maxHeight="h-full"
                        expandedMaxHeight="max-h-[90vh]"
                        maxWidth='max-w-[800px]'

                    />

                </div>

                {/* Third row */}
                {isConfirmedMatch && <MatchFoundScreen />}
                <div className='col-span-1 row-span-1 '>
                    <FindMatch />
                </div>
            </div>x
        </div>
    );
}