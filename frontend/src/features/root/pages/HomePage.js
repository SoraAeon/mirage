import React, { useState } from 'react';
import ChoicesGrid from '../../choices/components/ChoicesGrid';
import SignupCardGrid from '../../auth/components/SignupCardGrid';
// import LoginCardGrid from '../features/auth/LoginCardGrid';
// import QuestsGrid from '../features/quests/QuestsGrid';
// ...他もどんどんimport

export default function HomePage({ token, onLogin }) {
  const [uiMode, setUiMode] = useState('choices'); // 'choices' or 'signup' or 'login' など

  // クリックで切り替え
  const handleChangeMode = (mode) => setUiMode(mode);

  // どのグリッドを表示するかだけ切り替える
  if (uiMode === 'signup') {
    return <SignupCardGrid onSignup={() => setUiMode('choices')} onLogin={() => setUiMode('login')} />;
  }
  // if (uiMode === 'login') {
  //   return <LoginCardGrid onLogin={() => setUiMode('choices')} />;
  // }
  // if (uiMode === 'quests') {
  //   return <QuestsGrid onBack={() => setUiMode('choices')} />;
  // }
  // ...他も同様

  // デフォルト（ホーム画面の選択肢グリッド）
  return (
    <ChoicesGrid
      token={token}
      onLogin={() => setUiMode('login')}
      onSignup={() => setUiMode('signup')}
      onQuest={() => setUiMode('quests')}
      // ...他も好きなだけ
    />
  );
}