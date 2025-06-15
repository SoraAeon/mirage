import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './features/root/pages/HomePage';
import QuestsPage from './features/quests/pages/QuestPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import RecommendedQuestsPage from './features/quests/pages/RecommendedQuestsPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage token={token} onLogin={setToken} />} />
        <Route path="/quests" element={<QuestsPage token={token} />} />
        <Route path="/profiles" element={<ProfilePage token={token} />} />
        <Route path="/recommended" element={<RecommendedQuestsPage token={token} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;