import { useQuery } from "@apollo/client";
import { AppRoutes } from "./AppRoutes"
import SocketContextProvider from "./context/SocketContext";
import { useGetProfileQuery } from "@repo/graphql/types/client";
import { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import { initialize } from "./store/slices/profileSlice";
function App() {
  const { data, loading } = useGetProfileQuery()
  const dispatch = useAppDispatch()
  console.log('New', data, loading)
  useEffect(() => {
    dispatch(initialize(data))
  }, [data])
  if (loading) return <div className="w-full min-h-screen flex items-center justify-center">Fetching...</div>
  return (
    <>
      <SocketContextProvider>
        <AppRoutes />
      </SocketContextProvider>
    </>
  )
}

export default App
