import { useSocketContext } from "@/context/SocketContext"
import { RootMessage } from "@repo/messages/v2/message"


const useSocketClient = () => {
    const  socket  = useSocketContext();

    const sendRootMessage = (rootMessage: RootMessage) => {
        if (socket) {
            console.log('Message sent ✉️', rootMessage);
            socket.send(JSON.stringify(rootMessage));
        }
    };

    return {
        sendRootMessage,
    };
};

export default useSocketClient
