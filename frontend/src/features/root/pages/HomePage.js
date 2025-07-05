import React from 'react';
import { useMachine } from '@xstate/react';
import { signupMachine } from '../machines/signupMachine';
import FourCardGrid from '../components/FourCardGrid';
import CardButton from '../components/CardButton';
import SignupForm from '../../auth/components/SignupForm';

export default function SignupWithCards({ onLogin }) {
  const [state, send] = useMachine(signupMachine);
  const { username, email, password } = state.context;
  const allFieldsFilled = username && email && password;

  const signupSteps = [
    { id: 'username', title: 'Name', description: '好きな名前を入力', card_type: 'username' },
    { id: 'email', title: 'Mail Address', description: 'ご連絡用メール', card_type: 'email' },
    { id: 'password', title: 'Password', description: '8文字以上', card_type: 'password' },
    allFieldsFilled
      ? { id: 'submit', title: 'Submit', description: '全て入力して登録', card_type: 'submit' }
      : { id: 'login', title: 'or Login', description: '既にアカウントをお持ちの方', card_type: 'login' }
  ];

  const handleCardClick = (card) => {
    if (card.card_type === 'login') {
      send({ type: 'LOGIN' });
      onLogin && onLogin();
    } else if (card.card_type === 'submit') {
      send({ type: 'SUBMIT' });
      // サインアップ処理（API呼び出しなど）
    } else if (card.card_type === 'username') {
      const value = prompt('ユーザー名を入力:'); // お好みでinputなど
      if (value !== null) send({ type: 'SET_USERNAME', value });
    } else if (card.card_type === 'email') {
      const value = prompt('メールアドレスを入力:');
      if (value !== null) send({ type: 'SET_EMAIL', value });
    } else if (card.card_type === 'password') {
      const value = prompt('パスワードを入力:');
      if (value !== null) send({ type: 'SET_PASSWORD', value });
    }
  };

  return (
    <FourCardGrid
      cards={signupSteps}
      renderCard={(card, idx) => (
        <CardButton
          key={card.id}
          card={card}
          onClick={() => handleCardClick(card)}
        >
          {/* 選択されたカードのときにだけ、入力バーやモーダル出してもOK */}
        </CardButton>
      )}
    />
  );
}