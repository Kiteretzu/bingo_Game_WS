import { ChevronDown, Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";


interface PendingRequest {
  id: string;
  name: string;
  timestamp: string;
}

const PendingRequestsSection = () => {
    const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([
        { id: "p1", name: "Eve", timestamp: "2h ago" },
        { id: "p2", name: "Frank", timestamp: "5h ago" },
    ]);

    const [isPendingExpanded, setIsPendingExpanded] = useState(true);

    const handleAcceptRequest = (requestId: string) => {
        setPendingRequests(prev => prev.filter(request => request.id !== requestId));
        // Add logic to update friends list
    };

    const handleDeclineRequest = (requestId: string) => {
        setPendingRequests(prev => prev.filter(request => request.id !== requestId));
    };
    return (
        <div className="mb-6">
            <div
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => setIsPendingExpanded(!isPendingExpanded)}
            >
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-gray-200">Pending Requests</h3>
                    <span className="text-sm text-gray-400">({pendingRequests.length})</span>
                </div>
                <ChevronDown
                    className={`text-gray-400 transition-transform duration-200 ${isPendingExpanded ? "transform rotate-180" : ""
                        }`}
                    size={20}
                />
            </div>

            <div
                className={`transition-all duration-200 overflow-hidden ${isPendingExpanded ? "max-h-96" : "max-h-0"
                    }`}
            >
                <ul className="space-y-2">
                    {pendingRequests.map((request) => (
                        <li
                            key={request.id}
                            className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-700 p-3 rounded-md transition-all duration-200"
                        >
                            <div className="flex items-center gap-2">
                                <Clock className="text-yellow-500" size={16} />
                                <span className="text-gray-100">{request.name}</span>
                                <span className="text-sm text-gray-400">{request.timestamp}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleAcceptRequest(request.id)}
                                    className="bg-green-600 hover:bg-green-700 px-3 py-1 text-sm"
                                >
                                    Accept
                                </Button>
                                <Button
                                    onClick={() => handleDeclineRequest(request.id)}
                                    className="bg-red-600 hover:bg-red-700 px-3 py-1 text-sm"
                                >
                                    Decline
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
};

export default PendingRequestsSection;