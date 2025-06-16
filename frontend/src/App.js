import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './features/root/pages/HomePage';
import QuestsPage from './features/quests/pages/QuestPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import RecommendedQuestsPage from './features/quests/pages/RecommendedQuestsPage';
import ThemeSelectPage from './features/themes/pages/ThemeSelectPage';
import JobSelectPage from './features/themes/pages/JobSelectPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [selectedTheme, setSelectedTheme] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage token={token} onLogin={setToken} />} />
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
