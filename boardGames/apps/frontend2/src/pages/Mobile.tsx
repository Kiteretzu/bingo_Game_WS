import { useState } from 'react';
import ProfileDashboard from '../components/ProfileDashboard';
import GameHistory from '../components/GameHistory';
import Leaderboard from '../components/Leaderboard';
import HowToPlay from '../components/HowToPlay';
import FriendList from '../components/FriendList';
import FindMatch from '../components/FindMatch';
import useBingo from '@/hooks/useBingo';
import MatchFoundScreen from '@/components/dialog/matchFound-dialog';
import { ExpandableCard } from '@/components/Expandable-cards';
import "@/components/test.css";

export default function MobileDashboard() {
    const { isConfirmedMatch } = useBingo();
    const [activeTab, setActiveTab] = useState('home');

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div className="flex flex-col h-screen">
                        <div className="w-full mb-4">
                            <ProfileDashboard />
                        </div>
                        <div className="w-full flex-grow-0 basis-3/6 mb-4 overflow-auto">
                            <GameHistory />
                        </div>
                        <div className="w-full">
                            <FindMatch />
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center p-4">
                            <h2 className="text-xl font-semibold mb-2">Profile</h2>
                            <p className="text-gray-400">Profile section coming soon...</p>
                        </div>
                    </div>
                );
            case 'history':
                return <GameHistory />;
            case 'leaderboard':
                return <Leaderboard />;
            case 'howToPlay':
                return (
                    <ExpandableCard
                        item={<HowToPlay />}
                        renderItem={(item) => item}
                        maxHeight="h-full"
                        expandedMaxHeight="max-h-[80vh]"
                        maxWidth="max-w-full"
                    />
                );
            case 'friends':
                return <FriendList />;
            default:
                return null;
        }
    };

    return (
        <div className="text-white min-h-screen flex flex-col">
            {isConfirmedMatch && <MatchFoundScreen />}

            <div className="flex-1 p-4 animate-gradient-flow overflow-y-auto pb-16">
                {renderContent()}
            </div>

            <nav className="bg-gray-900 w-full flex justify-between items-center px-2 py-3 border-t border-gray-800 fixed bottom-0">
                <button
                    className={`flex flex-col items-center p-1 ${activeTab === 'home' ? 'text-blue-400' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('home')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-xs">Home</span>
                </button>

                <button
                    className={`flex flex-col items-center p-1 ${activeTab === 'profile' ? 'text-blue-400' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs">Profile</span>
                </button>


                <button
                    className={`flex flex-col items-center p-1 ${activeTab === 'leaderboard' ? 'text-blue-400' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('leaderboard')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-xs">Leaders</span>
                </button>

                <button
                    className={`flex flex-col items-center p-1 ${activeTab === 'friends' ? 'text-blue-400' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('friends')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-xs">Friends</span>
                </button>

                <button
                    className={`flex flex-col items-center p-1 ${activeTab === 'howToPlay' ? 'text-blue-400' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('howToPlay')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs">How To</span>
                </button>
            </nav>
        </div>
    );
}