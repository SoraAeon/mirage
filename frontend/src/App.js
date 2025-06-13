import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuestsPage from './pages/QuestsPage';
import ProfilePage from './pages/ProfilePage';
import RecommendedQuestsPage from './pages/RecommendedQuestsPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // ログイン成功時に呼ぶ関数
  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  // ログアウト関数（お好みで）
  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

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
