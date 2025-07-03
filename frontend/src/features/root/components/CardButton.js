import React from "react";

const ICONS = {
  quest: "/icons/quest.png",
  trial_quest: "/icons/trial.png",
  mission: "/icons/mission.png",
  auth_login: "icons/login.png",
  auth_signup: "icons/signup.png",
  login: "icons/login.png",
  signup: "icons/signup.png",
  email: "icons/email.png",
  password: "icons/password.png",
  username: "icons/username.png",
  submit: "icons/submit.png",
};

// 1枚のカードの見た目を統一
export default function CardButton({ card, onClick, children }) {
  const iconSrc = ICONS[card.card_type] || ICONS.default;

  return (
    <button
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