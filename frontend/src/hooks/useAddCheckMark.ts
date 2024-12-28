import { useSocket } from './useSocket'
import { ADD_CHECK_MARK, ADD_CHECK_MARK_DATA } from '@/constants'

function useAddCheckMark() {
  const socket = useSocket()

  const sendAddCheckMark = (data: ADD_CHECK_MARK_DATA) => {
    if (socket) {
      // Construct the message
      const message = {
        type: ADD_CHECK_MARK,
        data: data, 
      }

      // Send the message via WebSocket
      socket.send(JSON.stringify(message))
    }
  }

  return sendAddCheckMark
}

export default useAddCheckMark