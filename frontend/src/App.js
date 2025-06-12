import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuestsPage from './pages/QuestsPage';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '12px', borderBottom: '1px solid #ccc' }}>
        <Link to="/">ホーム</Link> | <Link to="/quests">クエスト</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quests" element={<QuestsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
