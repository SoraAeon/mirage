import React from 'react';

function ChoiceCard({ card, onSelect, token, onLogin }) {
  // カード種別で表示切り替え
  if (card.card_type === "auth") {
    return (
      <div className="choice-card auth-card" onClick={onLogin}>
        <h2>ログイン or 新規登録</h2>
        <p>冒険を始めるにはログインが必要です！</p>
      </div>
    );
  }
  if (card.card_type === "quest") {
    return (
      <div className={`choice-card quest-card ${card.locked ? 'locked' : ''}`} onClick={card.locked ? null : onSelect}>
        <h2>{card.title}</h2>
        <p>{card.description}</p>
        {card.locked && <span className="badge">進行中！</span>}
      </div>
    );
  }
  // 他のタイプ（profile, goalなど）も同様に分岐
  return null;
}

export default ChoiceCard;
