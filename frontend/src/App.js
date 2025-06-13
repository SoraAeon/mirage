import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuestsPage from './pages/QuestsPage';

function App() {
  // トークン管理
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // ログイン時にトークン保存
  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  // ログアウト
  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <BrowserRouter>
      <nav style={{ padding: '12px', borderBottom: '1px solid #ccc' }}>
        <Link to="/">ホーム</Link> | <Link to="/quests">クエスト</Link>
        {token && (
          <button style={{ marginLeft: 20 }} onClick={handleLogout}>ログアウト</button>
        )}
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage token={token} onLogin={handleLogin} />
          }
        />
        <Route
          path="/quests"
          element={
            token ? <QuestsPage token={token} /> : <HomePage token={token} onLogin={handleLogin} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
