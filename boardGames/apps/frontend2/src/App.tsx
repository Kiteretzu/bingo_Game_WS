import { useQuery } from "@apollo/client";
import { AppRoutes } from "./AppRoutes"
import SocketContextProvider from "./context/SocketContext";
import { LandingPageDocument, useLandingPageQuery } from "@repo/graphql/types/client";
function App() {
  const { data, loading } = useLandingPageQuery()
  const { data: da, loading: loda } = useQuery(LandingPageDocument)
  console.log({ da, loda })
  console.log('New', data, loading)
  return (
    <>
      <SocketContextProvider>
        <AppRoutes />
      </SocketContextProvider>
    </>
  )
}

export default App
