import React from 'react';
import FourCardGrid from './FourCardGrid';
import CardButton from './CardButton';

export default function Choices({ cards, onChangeMode, onCardSelect, onQuestSelect }) {
  // 分岐用ハンドラ
  const handlers = {
    auth_signup: () => onChangeMode && onChangeMode('signup'),
    auth_login:  () => onChangeMode && onChangeMode('login'),
    quest:       (card) => onQuestSelect && onQuestSelect(card),
    mission:     (card) => alert('ミッションは近日公開！'),
    // 追加したいtypeはここにどんどん追記
  };

  // カードクリック時
  const handleCardClick = (card) => {
    onCardSelect && onCardSelect(card);

    if (onQuestSelect) onQuestSelect(card);
    // 必要に応じてtypeごとの分岐
    if (card.card_type === 'auth_signup') {
      onChangeMode && onChangeMode('signup');
    } else if (card.card_type === 'auth_login') {
      onChangeMode && onChangeMode('login');
    } // ...他も追加
  };

  return (
    <FourCardGrid
      cards={cards}
      renderCard={(card, idx) => (
        <CardButton
          key={card.id || idx}
          card={card}
          onClick={() => handleCardClick(card)}
        />
      )}
    />
  );
}