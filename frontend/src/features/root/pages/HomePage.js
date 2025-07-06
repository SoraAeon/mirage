import React, { useState } from 'react';
import Choices from '../components/Choices';
import SignupForm from '../../auth/components/SignupForm';
import LoginForm from '../../auth/components/LoginForm';

export default function HomePage() {
  const [mode, setMode] = useState('choices');
  const [selectedQuest, setSelectedQuest] = useState(null);

  // 未ログインならこのカード配列
  const cards = [
    { id: 'q1', title: 'Quest', description: 'サンプルクエスト', card_type: 'quest' },
    { id: 'm1', title: 'Mission', description: 'サンプルミッション', card_type: 'mission' },
    { id: 'login', title: 'Login', description: 'ログイン', card_type: 'auth_login' },
    { id: 'signup', title: 'Sign Up', description: '今すぐ登録', card_type: 'auth_signup' }
  ];

  if (mode === 'signup')   return <SignupForm onLogin={() => setMode('choices')} />;
  if (mode === 'login')    return <LoginForm  onSignup={() => setMode('choices')} />;
  if (mode === 'quest')    return <div> {/* ここにQuest表示・選択処理 */} </div>;

  // ホーム（選択肢カード）
  return (
    <div>
      <h1 style={{
        color: "#fff",
        textShadow: "2px 2px 8px #222",
        textAlign: "center",
      }}>
        Select Your Card
      </h1>
      <Choices
        cards={cards}
        onChangeMode={setMode}
        onQuestSelect={(card) => { setSelectedQuest(card); setMode('quest'); }}
      />
    </div>
  );
}