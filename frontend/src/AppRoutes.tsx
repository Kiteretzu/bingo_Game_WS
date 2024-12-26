import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Game from '@/pages/Game';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}
