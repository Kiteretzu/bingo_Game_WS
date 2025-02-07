import { AppRoutes } from "./AppRoutes"
import SocketContextProvider from "./context/SocketContext";
import { useGetAuthProfileQuery } from "@repo/graphql/types/client";
import { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import { initialize } from "./store/slices/profileSlice";
import DialogContextProvider from "./context/DialogContext";
import { Loader } from "@repo/ui/exp";

function App() {
  const { data, loading } = useGetAuthProfileQuery()
  const dispatch = useAppDispatch()
  console.log('New', data?.authUser?.googleId, loading)
  useEffect(() => {
    dispatch(initialize(data))
  }, [data])
  if (loading) return <Loader />
  return (
    <>
      <SocketContextProvider>
        <DialogContextProvider>
          <AppRoutes />
        </DialogContextProvider>
      </SocketContextProvider>
    </>
  )
}

export default App
