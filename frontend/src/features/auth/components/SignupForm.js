import React, { useState } from 'react';
import CardButton from '../../root/components/CardButton';
import FourCardGrid from '../../root/components/FourCardGrid';

export default function SignupForm({ onSignup, onLogin }) {
  // 入力状態
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
  const [selectedStep, setSelectedStep] = useState(null);
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 入力完了チェック
  const allFieldsFilled = signupData.username && signupData.email && signupData.password;

  // 必要に応じてカードリストを「動的に生成」
  const signupSteps = [
    { id: 'username', title: 'Name', description: '好きな名前を入力', card_type: 'username' },
    { id: 'email', title: 'Mail Adress', description: 'ご連絡用メール', card_type: 'email' },
    { id: 'password', title: 'Password', description: '8文字以上', card_type: 'password' },
    allFieldsFilled
      ? { id: 'submit', title: 'Submit', description: '全て入力して登録', card_type: 'submit' }
      : { id: 'login', title: 'or Login', description: '既にアカウントをお持ちの方', card_type: 'login' }
  ];

  // カードクリック時
  const handleCardClick = (card) => {
    if (card.card_type === 'login') {
      onLogin && onLogin();
    } else if (card.card_type === 'submit') {
      handleSignup();
    } else {
      setSelectedStep(card.card_type);
    }
  };

  // 登録ボタン押下
  const handleSignup = (e) => {
    e && e.preventDefault();
    setMsg('');
    setSubmitting(true);
    fetch('/api/auth/users/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData)
    })
      .then(async res => {
        const data = await res.json();
        setSubmitting(false);
        if (res.ok) {
          setMsg('サインアップ成功！ログインしてください。');
          setSignupData({ username: '', email: '', password: '' });
          if (onSignup) onSignup();
        } else {
          setMsg('エラー: ' + (data && typeof data === "object" ? JSON.stringify(data) : "サインアップ失敗"));
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
            value={signupData.username}
            onChange={e => setSignupData({ ...signupData, username: e.target.value })}
            placeholder="User Name"
            style={{ width: "85%", marginTop: 8 }}
            disabled={submitting}
            autoFocus
          />
        );
      case 'email':
        return (
          <input
            value={signupData.email}
            onChange={e => setSignupData({ ...signupData, email: e.target.value })}
            placeholder="Mail Adress"
            type="email"
            style={{ width: "85%", marginTop: 8 }}
            disabled={submitting}
            autoFocus
          />
        );
      case 'password':
        return (
          <input
            value={signupData.password}
            onChange={e => setSignupData({ ...signupData, password: e.target.value })}
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
      <h2 style={{
        color: "#fff",
        fontFamily: "'Press Start 2P', cursive",
        textAlign: "center",
        letterSpacing: "0.04em",
        marginBottom: 24
      }}>
        Sign Up
      </h2>
      <FourCardGrid
        cards={signupSteps}
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
