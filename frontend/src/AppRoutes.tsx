import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Game from '@/pages/Game';
import Landing from './pages/Landing';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/game/:id" element={<Game />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}
