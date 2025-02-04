
import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useBingo from "@/hooks/useBingo"



export default function AddFriendPopup() {
  const [friendId, setFriendId] = useState("")
  const { setIsOpenAddFriend, handleAddFriend } = useBingo()

  const onClose = () => setIsOpenAddFriend(false)


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (friendId.trim()) {
      handleAddFriend(friendId)
      setFriendId("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Add Friend</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Enter friend's ID"
              value={friendId}
              onChange={(e) => setFriendId(e.target.value)}
              className="w-full bg-gray-800 text-white border-gray-700 focus:border-gray-600"
            />
          </div>
          <Button type="submit" className="w-full bg-gray-700 hover:bg-gray-600 text-white">
            Add Friend
          </Button>
        </form>
      </div>
    </div>
  )
}

