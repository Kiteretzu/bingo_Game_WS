import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Game from '@/pages/Game';
import Landing from './pages/Landing';
import TokenPage from './pages/TokenPage';
import Test from './pages/test';
import ProfilePage from './pages/Profile';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/game/:id" element={<Game />} />
        <Route path="/" element={<Landing />} />
        <Route path="/profile" element={<TokenPage />} />
        <Route path="/test" element={<Test />} />
        <Route path="/dashboard" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
