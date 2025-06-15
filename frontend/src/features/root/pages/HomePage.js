import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../../auth/components/SignupForm';
import LoginForm from '../../auth/components/LoginForm';

function HomePage({ token, onLogin }) {
  const [showSignup, setShowSignup] = useState(false);

  if (token) {
    return (
      <div style={{ padding: "32px" }}>
        <h1>RealPG: 行動で世界を変えるSNS</h1>
        <p>
          <Link to="/quests">
            <button style={{ fontSize: "1.2em", padding: "12px 24px" }}>
              クエスト一覧を見る
            </button>
          </Link>
        </p>
        <p>ログイン済み！</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px" }}>
      <h1>RealPG: 行動で世界を変えるSNS</h1>
      <p>やってみたい行動（クエスト）をシェアして、人生をもっと面白くしよう！</p>

      <div style={{ marginBottom: "24px" }}>
        <button onClick={() => setShowSignup(!showSignup)}>
          {showSignup ? "ログイン" : "新規登録"}
        </button>
      </div>

      {showSignup ? (
        <SignupForm onSignup={() => setShowSignup(false)} />
      ) : (
        <LoginForm onLogin={onLogin} />
      )}
    </div>
  );
}

export default HomePage;
