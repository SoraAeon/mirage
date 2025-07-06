import React, { useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import { choicesMachine, getCardsForState } from '../machines/choicesMachine';
import FourCardGrid from '../../root/components/FourCardGrid';
import CardButton from '../../root/components/CardButton';

export default function ChoicesGrid(props) {
  const [state, send] = useMachine(choicesMachine);
  // カードはstate.valueから自動取得
  const cards = getCardsForState(state.value, state.context);
  // 入力状態：どのカードか＋その値
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const handleCardClick = (card) => {
    // 入力系カードなら選択状態だけ切り替える
    if (['username', 'email', 'password'].includes(card.card_type)) {
      setSelectedCardId(card.id);
      setInputValue(state.context[card.card_type] || '');
      return;
    }
    // それ以外はそのままsend
    if (card.card_type === 'auth_login') send({ type: 'LOGIN' });
    if (card.card_type === 'auth_signup') send({ type: 'SIGNUP' });
    if (card.card_type === 'submit') send({ type: 'SUBMIT' });
    // ...他も
  };

  // 入力フォームで値が変わったとき
  const handleInputChange = (e, card_type) => {
    setInputValue(e.target.value);
  };

  // エンター or ボタンで値をmachineに渡す
  const handleInputSubmit = (card) => {
    send({ type: `SET_${card.card_type.toUpperCase()}`, value: inputValue });
    setSelectedCardId(null); // 入力終わったらフォームを消す
    setInputValue('');
  };

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
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card)}
          >
            {/* ↓このchildrenで入力UIを出す */}
            {selectedCardId === card.id && (
              <div style={{ marginTop: 16, width: "100%", textAlign: "center" }}>
                <input
                  style={{
                    padding: "6px 10px",
                    borderRadius: 7,
                    marginBottom: 8,
                    width: "80%"
                  }}
                  type={card.card_type === 'password' ? 'password' : (card.card_type === 'email' ? 'email' : 'text')}
                  value={inputValue}
                  onChange={e => handleInputChange(e, card.card_type)}
                  onKeyDown={e => { if (e.key === "Enter") handleInputSubmit(card); }}
                  autoFocus
                />
              </div>
            )}
          </CardButton>
        )}
      />
    </div>
  );
}