import React from "react";

import questIcon from '../../../assets/icons/quest.png';
import trialQuestIcon from '../../../assets/icons/trial.png';
import missionIcon from '../../../assets/icons/mission.png';
import authLoginIcon from '../../../assets/icons/login.png';
import authSignupIcon from '../../../assets/icons/signup.png';
import loginIcon from '../../../assets/icons/login.png';      // ログインとauth_loginは同じでOK
import signupIcon from '../../../assets/icons/signup.png';    // サインアップとauth_signupも同じでOK
import emailIcon from '../../../assets/icons/email.png';
import passwordIcon from '../../../assets/icons/password.png';
import usernameIcon from '../../../assets/icons/username.png';
import submitIcon from '../../../assets/icons/submit.png';

const ICONS = {
  quest: questIcon,
  trial_quest: trialQuestIcon,
  mission: missionIcon,
  auth_login: authLoginIcon,
  auth_signup: authSignupIcon,
  login: loginIcon,
  signup: signupIcon,
  email: emailIcon,
  password: passwordIcon,
  username: usernameIcon,
  submit: submitIcon,
};

// 1枚のカードの見た目を統一
export default function CardButton({ card, onClick, children }) {
  const iconSrc = card.icon || ICONS[card.card_type] || ICONS.default;

  return (
    <button
      key={card.id}
      onClick={onClick}
      style={{
        background: 'url("/quest-bg.png") center/cover no-repeat, #222',
        border: "none",
        borderRadius: 13,
        padding: 0,
        width: 220,
        height: 220,
        boxShadow: "0 2px 12px #0007",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.15s",
        cursor: "pointer"
      }}
    >

      {/* ゲーム風フォントのタイトル */}
      <div
        style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: "2em",
          color: "#fff",
          textShadow: "2px 2px 6px #222",
          marginBottom: 20,
          textAlign: "center"
        }}
      >
        {card.title}
      </div>
      {/* 説明（必要なら） */}
      <div
        style={{
          fontSize: "1em",
          color: "#808080",
          textAlign: "center",
          minHeight: 40,
          fontFamily: "'Press Start 2P', cursive"
        }}
      >
        {card.description}
      </div>
      {/* アイコン画像 */}
      <img
        src={iconSrc}
        alt={card.card_type}
        style={{
          width: 54,
          height: 54,
          marginBottom: 14,
          objectFit: "contain",
          filter: "drop-shadow(2px 2px 4px #000a)"
        }}
      />
      {children}
    </button>
  );
}