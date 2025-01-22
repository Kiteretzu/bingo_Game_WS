import ProfileDashboard from '../components/ProfileDashboard';
import GameHistory from '../components/GameHistory';
import Leaderboard from '../components/Leaderboard';
import HowToPlay from '../components/HowToPlay';
import DeveloperMessage from '../components/DeveloperMessage';
import FindMatchButton from '../components/buttons/FindMatchButton';
import "@/components/test.css";
import useBingo from '@/hooks/useBingo';
import MatchFoundScreen from '@/components/dialog/matchFound-dialog';
import FriendList from '@/components/FriendList';
import FindMatch from '@/components/FindMatch';

export default function Dashboard() {
    const { findMatch, cancelFindMatch, isFinding, isMatchFound } = useBingo()
    const dummyPLayerData = [
        {
            "user": {
                "googleId": "104289912510462898930",
                "displayName": "SMARTH VERMA 231030118",
                "avatar": "https://lh3.googleusercontent.com/a/ACg8ocKp1etKaqOvzxwLqMrtjjjDup6OxPfl6h3oCPEr3P3_6A_DZQpE=s96-c",
                "bingoProfile": {
                    "id": "b9cc8d04-db50-4cca-97ed-e93d2f663b37",
                    "mmr": 0,
                    "league": "BRONZE"
                }
            }
        },
        {
            "user": {
                "googleId": "104799612309977347789",
                "displayName": "Smarth Verma (Skiii)",
                "avatar": "https://lh3.googleusercontent.com/a/ACg8ocL5JozG39wiY6N8icBnzdfD29csr9xFsl8KsJbyKSb-_CLgnAdX=s96-c",
                "bingoProfile": {
                    "id": "a6a9b042-5899-43eb-87be-38a4f3444852",
                    "mmr": 0,
                    "league": "BRONZE"
                }
            }
        }
    ]
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
                <div className="col-span-1 row-span-2">
                    <HowToPlay />
                </div>
                <div className="col-span-1 row-span-3">
                    <FriendList />
                </div>
                <div className="col-span-1 row-span-2">
                    <DeveloperMessage />
                </div>

                {/* Third row */}
                {isMatchFound && <MatchFoundScreen />}
                <FindMatch />
                
            </div>
        </div>
    );
}

