import React, { useState } from 'react';
import CardButton from '../../root/components/CardButton';
import FourCardGrid from '../../root/components/FourCardGrid';

export default function LoginForm({ onLogin, onSignup }) {
  // 入力状態
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [selectedStep, setSelectedStep] = useState(null);
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 入力完了チェック
  const allFieldsFilled = loginData.username && loginData.password;

  // ログイン時のカードリスト（4つ目がSubmit or SignUp）
  const loginSteps = [
    { id: 'username', title: 'Name', description: 'ユーザー名を入力', card_type: 'username' },
    { id: 'password', title: 'Password', description: 'パスワード', card_type: 'password' },
    { id: 'forgot', title: 'Forget?', description: 'パスワードを再発行', card_type: 'password' },
    allFieldsFilled
      ? { id: 'submit', title: 'Login', description: 'ログイン', card_type: 'submit' }
      : { id: 'signup', title: 'or Sign Up', description: 'アカウント作成へ', card_type: 'signup' },
    // 4枚目にダミーカードを出したい場合（例えば「トップに戻る」とか）はここに追加
  ];

  // カードクリック時
  const handleCardClick = (card) => {
    if (card.card_type === 'signup') {
      onSignup && onSignup();
    } else if (card.card_type === 'submit') {
      handleLogin();
    } else {
      setSelectedStep(card.card_type);
    }
  };

  // ログインボタン押下
  const handleLogin = (e) => {
    e && e.preventDefault();
    setMsg('');
    setSubmitting(true);
    fetch('/api/auth/token/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    })
      .then(async res => {
        const data = await res.json();
        setSubmitting(false);
        if (res.ok && data.auth_token) {
          setMsg('ログイン成功！');
          // 必要に応じてトークン保存＆親に通知
          if (onLogin) onLogin(data.auth_token);
          setLoginData({ username: '', password: '' });
        } else {
          setMsg('エラー: ' + (data && typeof data === "object" ? JSON.stringify(data) : "ログイン失敗"));
        }
      })
      .catch(() => {
        setSubmitting(false);
        setMsg('ネットワークエラー');
      });
  };

  // カードごとの入力UI
  const renderCardInput = (card) => {
    switch (card.card_type) {
      case 'username':
        return (
          <input
            value={loginData.username}
            onChange={e => setLoginData({ ...loginData, username: e.target.value })}
            placeholder="User Name"
            style={{ width: "85%", marginTop: 8 }}
            disabled={submitting}
            autoFocus
          />
        );
      case 'password':
        return (
          <input
            value={loginData.password}
            onChange={e => setLoginData({ ...loginData, password: e.target.value })}
            placeholder="Password"
            type="password"
            style={{ width: "85%", marginTop: 8 }}
            disabled={submitting}
            autoFocus
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 style={{
        color: "#fff",
        textShadow: "2px 2px 8px #222",
        textAlign: "center"
      }}>
        Login
      </h1>
      <FourCardGrid
        cards={loginSteps}
        renderCard={(card, idx) => (
          <CardButton
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card)}
          >
            {selectedStep === card.card_type && renderCardInput(card)}
          </CardButton>
        )}
      />
      {msg && (
        <div style={{ color: "#fff", textAlign: "center", marginTop: 16, fontFamily: "'Press Start 2P', cursive" }}>
          {msg}
        </div>
      )}
    </div>
  );
}
