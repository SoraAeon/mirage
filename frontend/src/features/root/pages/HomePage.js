import React, { useState } from 'react';
import Scene from '../../../components/Scene';
import Choices from '../components/Choices';
import SignupForm from '../../auth/components/SignupForm';
import LoginForm from '../../auth/components/LoginForm';

export default function HomePage() {
  const [mode, setMode] = useState('choices');
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [cubeRotation, setCubeRotation] = useState([0, 0, 0]);
  // right, left, top, bottom, back, front
  const [faceIcons, setFaceIcons] = useState([null, null, null, null, null, null]); 

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

  // カード選択で
  function handleCardSelect(card) {
  if (card.icon) {
    const updatedIcons = [...faceIcons];
    updatedIcons[0] = card.icon; // 右面にセット（必要なら今後他の面も）
    setFaceIcons(updatedIcons);
  }
  // 他のロジックも分岐で呼んでOK
}

  // Submit/Clearで回転
  function handleClear() {
    // 右回転（y軸でMath.PI/2加算）
    setCubeRotation(([x, y, z]) => [x, y + Math.PI / 2, z]);
    // 次のカード・次の面のロジックもここで
  }

  // シーンに渡す
  <Scene
    rotation={cubeRotation}
    faceIcons={faceIcons}
  />

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
        onCardSelect={handleCardSelect}
        onQuestSelect={(card) => { setSelectedQuest(card); setMode('quest'); }}
      />
    </div>
  );
}