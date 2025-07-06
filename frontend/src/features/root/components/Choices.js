import React from 'react';
import FourCardGrid from './FourCardGrid';
import CardButton from './CardButton';

export default function Choices({ cards, onChangeMode, onQuestSelect }) {
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
    const handler = handlers[card.card_type];
    if (handler) handler(card);
    else {
      // 未定義タイプは何もしない or デバッグ用
      console.log("Unhandled card_type:", card.card_type);
    }
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