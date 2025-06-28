import React, { useState } from 'react';
import Scene from './components/Scene';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuestsPage from './features/quests/pages/QuestPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import RecommendedQuestsPage from './features/quests/pages/RecommendedQuestsPage';
import ThemeSelectPage from './features/themes/pages/ThemeSelectPage';
import JobSelectPage from './features/themes/pages/JobSelectPage';
import ChoicesPage from './features/choices/pages/ChoicesPage';
import SceneController from './components/SceneController'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [selectedTheme, setSelectedTheme] = useState(null);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* 上半分：3D Scene */}
        <div style={{ flex: 1 }}>
          <SceneController />
        </div>

        {/* 下半分：選択肢や画面UI */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
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
            <Route path="/scene" element={<SceneController />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
