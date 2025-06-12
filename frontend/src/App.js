import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VillagePage from './pages/VillagePage';
import QuestsPage from './pages/QuestsPage'; // 新しく作る予定の画面
import HomePage from './pages/HomePage';     // トップページなど

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/village" element={<VillagePage />} />
        <Route path="/quests" element={<QuestsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;