import { useState } from "react";
import { X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useBingo from "@/hooks/useBingo";
import { useSendFriendRequestMutation } from "@repo/graphql/types/client";
import { defaultToastConfig } from "@/utils/toastConfig";
import { toast } from "react-toastify";

export default function AddFriendDialog() {
  const [friendId, setFriendId] = useState("");
  const { isOpenAddFriend, setIsOpenAddFriend, handleAddFriend, isAuth } =
    useBingo();

  const [handleSendFriendRequest, { data }] = useSendFriendRequestMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (friendId.trim()) {
      handleAddFriend({ to: friendId.trim() });
      setIsOpenAddFriend(false);
      setFriendId("");
      toast.success("Requst sent!", defaultToastConfig);
    }
  };

  return (
    <Dialog open={isOpenAddFriend} onOpenChange={setIsOpenAddFriend}>
      <DialogTrigger asChild>
        <Button
          disabled={!isAuth}
          className="bg-[#3f6d44] hover:bg-[#3b603f] text-white font-semibold transition-colors duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Add Friend
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border border-gray-700 sm:max-w-md">
        <div className="flex items-center justify-between mb-4">
          <DialogTitle className="text-xl font-semibold text-white">
            Add Friend
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpenAddFriend(false)}
            className="text-gray-400 hover"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter friend's ID"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            className="w-full bg-gray-800 text-white border-gray-700 focus:border-gray-600"
          />
          <Button
            disabled={!isAuth}
            type="submit"
            className="w-full  bg-[#3f6d44] hover:bg-[#3b603f] text-white disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Add Friend
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
