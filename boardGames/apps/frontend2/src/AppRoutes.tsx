import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Game from '@/pages/Game';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Home from './app/page';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/game/:id" element={<Game />} />
        <Route path="/" element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/test" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
