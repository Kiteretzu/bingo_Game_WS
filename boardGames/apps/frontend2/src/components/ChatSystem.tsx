import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { twMerge } from 'tailwind-merge';

const dummyMessages = [
    { id: 1, sender: "Alice", message: "Hey there!", timestamp: "09:00" },
    { id: 2, sender: "Bob", message: "Hi Alice! How are you?", timestamp: "09:01" },
    { id: 3, sender: "Alice", message: "I'm doing great, thanks!", timestamp: "09:02" },
    { id: 4, sender: "Bob", message: "That's wonderful to hear!", timestamp: "09:03" },
    { id: 5, sender: "Alice", message: "How about you?", timestamp: "09:04" },
];

interface ChatSystemProps {
    player: string;
    className?: string; // Optional className
}

function ChatSystem({ player, className }: ChatSystemProps) {
    const [messages, setMessages] = React.useState<typeof dummyMessages>(dummyMessages);
    const [newMessage, setNewMessage] = React.useState<string>("");
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    id: prevMessages.length + 1,
                    sender: player,
                    message: newMessage.trim(),
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
            setNewMessage("");
        }
    };

    return (
        <Card className={twMerge("w-full max-w-xs bg-gray-800 border-gray-700", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${player}`} />
                        <AvatarFallback>{player?.[0] ?? "?"}</AvatarFallback>
                    </Avatar>
                    <span className="text-lg">{player}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ScrollArea className="h-[300px] pr-4" ref={scrollRef}>
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${msg.sender === player ? 'items-end' : 'items-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg px-3 py-2 ${msg.sender === player
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-100'
                                        }`}
                                >
                                    <p className="text-sm">{msg.message}</p>
                                </div>
                                <span className="text-xs text-gray-400 mt-1">
                                    {msg.sender} • {msg.timestamp}
                                </span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        aria-label="Message Input"
                        className="flex-1 bg-gray-700 border-gray-600 text-white"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="bg-blue-600 hover:bg-blue-700"
                        aria-label="Send Message"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default ChatSystem;