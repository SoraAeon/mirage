import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ padding: "32px" }}>
      <h1>RealPG: 行動で世界を変えるSNS</h1>
      <p>やってみたい行動（クエスト）をシェアして、人生をもっと面白くしよう！</p>
      <Link to="/quests">
        <button style={{ fontSize: "1.2em", padding: "12px 24px" }}>
          クエスト一覧を見る
        </button>
      </Link>
    </div>
  );
}

export default HomePage;
