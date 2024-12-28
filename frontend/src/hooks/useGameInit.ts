import React, { useEffect, useState } from 'react'
import { useSocket } from './useSocket'

function useGameInit() {
  const socket = useSocket()
  const [gameStatus, setGameStatus] = useState<'initializing' | 'ready' | 'error'>('initializing')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    // Check if socket is available
    if (!socket) {
      setGameStatus('error')
      setErrorMessage('Socket connection failed.')
      return
    }

    // Initialize game logic once socket is connected
    const initializeGame = () => {
      // Example: Send game initialization message to the server
      socket.send(JSON.stringify({ type: 'INIT_GAME', data: {} }))

      // Example: Set the game status to 'ready' after initialization
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if (message.type === 'GAME_READY') {
          setGameStatus('ready')
        }
      }

      // Handle socket errors
      socket.onerror = (error) => {
        setGameStatus('error')
        setErrorMessage(`WebSocket error: ${error.message}`)
      }
    }

    // Call the game initialization logic
    initializeGame()

    // Cleanup the socket connection when the component unmounts
    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [socket])

  return { gameStatus, errorMessage }
}

export default useGameInit