import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";

export function RemoveFriendDialog({ friendId }: { friendId: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button>
          <Trash
            className="text-red-500 opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-110 transition-all duration-200"
            size={20}
          />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="red-blue-400">
            Remove Friend?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Are you sure you want to remove friend?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction className="bg-red-5 00 text-white hover:bg-red-600">
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
