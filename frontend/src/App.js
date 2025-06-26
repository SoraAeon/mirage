import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuestsPage from './features/quests/pages/QuestPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import RecommendedQuestsPage from './features/quests/pages/RecommendedQuestsPage';
import ThemeSelectPage from './features/themes/pages/ThemeSelectPage';
import JobSelectPage from './features/themes/pages/JobSelectPage';
import ChoicesPage from './features/choices/pages/ChoicesPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [selectedTheme, setSelectedTheme] = useState(null);

  // ログイン成功時にtokenをセットする関数
  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChoicesPage token={token} onLogin={handleLogin} />} />
        <Route path="/theme-select" element={
          <ThemeSelectPage onSelect={setSelectedTheme} />
        } />
        <Route path="/job-select" element={
          <JobSelectPage selectedTheme={selectedTheme} token={token} />
        } />
        <Route path="/quests" element={<QuestsPage token={token} />} />
        <Route path="/profiles" element={<ProfilePage token={token} />} />
        <Route path="/recommended" element={<RecommendedQuestsPage token={token} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
