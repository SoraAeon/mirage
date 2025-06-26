import React, { useEffect, useState } from 'react';
import ChoiceCard from '../components/ChoiceCard';
import '../../../assets/quest-bg.png'; // ←なくてもOK（背景はCSSで指定）

function ChoicesPage({ token, onLogin }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // カードデータ取得
  useEffect(() => {
    setLoading(true);
    fetch('/api/choices/user-choices/', {
      headers: token ? { 'Authorization': `Token ${token}` } : {},
    })
      .then(res => res.json())
      .then(data => {
        setCards(data);
        setLoading(false);
      });
  }, [token]);

  // カード選択時
  const handleCardSelect = async (card) => {
    if (card.card_type === 'auth') {
      // ログイン/Signup処理
      onLogin && onLogin(); // 実際はログインモーダル表示など
      return;
    }
    if (card.locked) {
      // ロック中なら何もしない or クエスト進行画面へ
      return;
    }
    // Quest選択の場合など
    await fetch('/api/choices/select/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Token ${token}` } : {}),
      },
      body: JSON.stringify({ card_id: card.id })
    });
    // 再取得
    fetch('/api/choices/user-choices/', {
      headers: token ? { 'Authorization': `Token ${token}` } : {},
    })
      .then(res => res.json())
      .then(data => setCards(data));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div
      className="choices-board"
      style={{
        background: 'url("/quest-bg.png") center/cover no-repeat',
        minHeight: '100vh',
        padding: '40px 0',
      }}
    >
      <h1 style={{ color: "#fff", textShadow: "2px 2px 8px #222" }}>Select Your Card</h1>
      <div
        className="choices-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "32px",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "860px",
          margin: "40px auto",
        }}
      >
        {cards.map((card, idx) => (
          <ChoiceCard
            key={idx}
            card={card}
            onSelect={() => handleCardSelect(card)}
            token={token}
            onLogin={onLogin}
          />
        ))}
      </div>
    </div>
  );
}

export default ChoicesPage;
