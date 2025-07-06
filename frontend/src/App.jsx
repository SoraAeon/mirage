// App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Scene from './components/Scene';
import HomePage from './features/root/pages/HomePage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
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
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
