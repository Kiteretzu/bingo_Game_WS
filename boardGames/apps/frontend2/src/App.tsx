import { AppRoutes } from "./AppRoutes"
import SocketContextProvider from "./context/SocketContext";


function App() {

  return (
    <>
      <SocketContextProvider>
      <AppRoutes />
      </SocketContextProvider>
    </>
  )
}

export default App
