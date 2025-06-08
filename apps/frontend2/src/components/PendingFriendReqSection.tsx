import { ChevronDown, Clock, UserPlus, Users, Check, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  GetAllFriendRequestsDocument,
  GetFriendsDocument,
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useGetAllFriendRequestsQuery,
} from "@repo/graphql/types/client";
import { getRelativeTime } from "@/lib/getRelativeTime";

const PendingRequestsSection = () => {
  const [isPendingExpanded, setIsPendingExpanded] = useState(true);

  const { data, loading } = useGetAllFriendRequestsQuery();

  const [handleAcceptRequest] = useAcceptFriendRequestMutation({
    refetchQueries: [GetFriendsDocument, GetAllFriendRequestsDocument],
  });
  const [handleDeclineRequest] = useDeclineFriendRequestMutation({
    refetchQueries: [GetAllFriendRequestsDocument],
  });

  return (
    <div className="mb-6">
      <div
        className="flex items-center justify-between cursor-pointer mb-2 group"
        onClick={() => setIsPendingExpanded(!isPendingExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Users className="text-blue-400" size={24} />
            <h3 className="text-xl font-semibold text-gray-200">
              Pending Requests
            </h3>
          </div>
          {(data?.getFriendRequest?.length ?? 0) > 0 && (
            <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors duration-200">
              <UserPlus size={14} className="mr-1" />
              {data?.getFriendRequest.length}
            </Badge>
          )}
        </div>
        <ChevronDown
          className={`text-gray-400 transition-transform duration-200 group-hover:text-gray-200 ${
            isPendingExpanded ? "transform rotate-180" : ""
          }`}
          size={20}
        />
      </div>

      <div
        className={`transition-all duration-200 overflow-hidden ${
          isPendingExpanded ? "max-h-96" : "max-h-0"
        }`}
      >
        {loading ? (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full" />
          </div>
        ) : data?.getFriendRequest?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 rounded-lg">
            <Users className="text-gray-400 mb-2" size={24} />
            <p className="text-gray-400 text-sm">No pending friend requests</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {data?.getFriendRequest.map((request) => (
              <li
                key={request?.id}
                className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-700 p-3 rounded-md transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <Clock className="text-yellow-500" size={16} />
                  <span className="text-gray-100 max-w-[16ch] truncate">
                    {request?.sender.displayName}
                  </span>
                  <span className="text-sm text-gray-400">
                    {getRelativeTime(request?.createdAt!)}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptRequest({
                        variables: { requestId: request?.id! },
                      });
                    }}
                    className="p-2 rounded-full opacity-30 bg-gray-600 hover:bg-green-600 hover:opacity-100 text-gray-200 hover:text-white transition-colors duration-200"
                    aria-label="Accept request"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeclineRequest({
                        variables: { requestId: request?.id! },
                      });
                    }}
                    className="p-2 rounded-full opacity-30 bg-gray-600 hover:bg-red-600 hover:opacity-100 text-gray-200 hover:text-white transition-colors duration-200"
                    aria-label="Decline request"
                  >
                    <X size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PendingRequestsSection;
