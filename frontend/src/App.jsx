// App.js
import React, { useState } from 'react';
import Scene from './components/Scene';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuestsPage from './features/quests/pages/QuestPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import RecommendedQuestsPage from './features/quests/pages/RecommendedQuestsPage';
import ThemeSelectPage from './features/themes/pages/ThemeSelectPage';
import JobSelectPage from './features/themes/pages/JobSelectPage';
import ChoicesPage from './features/choices/pages/ChoicesPage';
import HomePage from './features/root/pages/HomePage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [rotation, setRotation] = useState([0, 0, 0]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleMove = (dir) => {
    setRotation((prev) => {
      switch (dir) {
        case 'left': return [prev[0], prev[1] + Math.PI / 2, prev[2]];
        case 'right': return [prev[0], prev[1] - Math.PI / 2, prev[2]];
        case 'back': return [prev[0] + Math.PI / 2, prev[1], prev[2]];
        case 'front': return [prev[0] - Math.PI / 2, prev[1], prev[2]];
        default: return prev;
      }
    });
  };

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* 上半分：3D Scene */}
        <div style={{ flex: 4, minHeight: 0 }}>
          <Scene rotation={rotation} />
        </div>

        {/* 下半分：選択肢や画面UI */}
        <div style={{ flex: 6, minHeight: 0, overflowY: 'hidden' }}>
          <Routes>
            <Route path="/" element={<HomePage token={token} onLogin={handleLogin} />} />
            <Route path="/choices" element={<ChoicesPage token={token} onLogin={handleLogin} />} />
            <Route path="/theme-select" element={<ThemeSelectPage onSelect={setSelectedTheme} />} />
            <Route path="/job-select" element={<JobSelectPage onMove={handleMove} selectedTheme={selectedTheme} token={token} />} />
            <Route path="/quests" element={<QuestsPage token={token} />} />
            <Route path="/profiles" element={<ProfilePage token={token} />} />
            <Route path="/recommended" element={<RecommendedQuestsPage token={token} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
