import React, { useEffect, useState } from 'react';
import CardButton from '../../root/components/CardButton'; 
import FourCardGrid from '../../root/components/FourCardGrid'; 
import LoginForm from '../../auth/components/LoginForm';
import SignupForm from '../../auth/components/SignupForm';

function ChoicesPage({ token, onLogin }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    if (!token) {
      setCards([
        {
          id: 'quest1',
          title: 'Quest',
          description: 'サンプル・クエスト',
          card_type: 'quest'
        },
        {
          id: 'mission1',
          title: 'Mission',
          description: 'サンプル・ミッション',
          card_type: 'mission'
        },
        {
          id: 'login',
          title: 'Login',
          description: 'すでにアカウントがある方はこちら',
          card_type: 'auth_login'
        },
        {
          id: 'signup',
          title: 'Sign Up',
          description: '今すぐ無料スタート！',
          card_type: 'auth_signup'
        }
      ]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch('/api/choices/user-choices/', {
      headers: { Authorization: `Token ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setCards(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      });
  }, [token]);

  const handleCardSelect = async (card) => {
    if (card.card_type === 'auth_login') {
      onLogin && onLogin();
      return;
    }
    if (card.card_type === 'auth_signup') {
      setShowSignup(true);
      return;
    }
    if (card.locked) return;
    await fetch('/api/choices/select/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Token ${token}` } : {}),
      },
      body: JSON.stringify({ card_id: card.id })
    });
    fetch('/api/choices/user-choices/', {
      headers: token ? { 'Authorization': `Token ${token}` } : {},
    })
      .then(res => res.json())
      .then(data => setCards(Array.isArray(data) ? data : data.results || []));
  };

  if (loading) return <div>Loading...</div>;

  // ★「showSignup」がtrueならサインアップフォームを最優先で表示
  if (showSignup) {
    return (
      <div style={{ minHeight: "100vh", background: "#14181e", paddingTop: 40 }}>
        <SignupForm
          onSignup={() => setShowSignup(false)} // 登録後はホームに戻る
          onLogin={() => { setShowSignup(false); onLogin && onLogin(); }} // 「ログインへ」カードもサポート
        />
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button onClick={() => setShowSignup(false)} style={{
            fontFamily: "'Press Start 2P', cursive",
            padding: "8px 28px",
            borderRadius: 10,
            border: "none",
            marginTop: 16
          }}>← 戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="choices-board"
      style={{
        background: "#14181e",
        minHeight: '100vh',
        padding: '40px 0',
      }}
    >
      <h1 style={{
        color: "#fff",
        textShadow: "2px 2px 8px #222",
        textAlign: "center"
      }}>
        Select Your Card
      </h1>
      <FourCardGrid
        cards={cards}
        renderCard={(card, idx) => (
          <CardButton
            key={card.id || idx}
            card={card}
            onClick={() => handleCardSelect(card)}
          >
          </CardButton>
        )}
      />
      {/* ログインカードが選ばれた場合にフォーム出す例（オプション） */}
      {/* cards.length === 1 && cards[0].card_type === 'auth' ? (
        <div style={{ marginTop: 32 }}>
          <LoginForm onLogin={onLogin} />
          <SignupForm onSignup={onLogin} />
        </div>
      ) : null */}
    </div>
  );
}

export default ChoicesPage;
