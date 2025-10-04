import { BrowserRouter, Route, Routes } from "react-router-dom";
import Game from "@/pages/Game";
import Landing from "@/pages/Landing";
import TokenPage from "@/pages/TokenPage";
import Test from "@/pages/test";
import ProfilePage from "@/pages/Profile";
import Mobile from "@/pages/Mobile";
import MonopolyGamePage from "./pages/monoply/MonoplyGamePage";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/game/:id" element={<Game />} />
        <Route path="/" element={<Landing />} />
        <Route path="/profile" element={<TokenPage />} />
        <Route path="/test" element={<Test />} />
        <Route path="/dashboard" element={<ProfilePage />} />
        <Route path="/mobile" element={<Mobile />} />
        <Route path="/monoply/game" element={<MonopolyGamePage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
