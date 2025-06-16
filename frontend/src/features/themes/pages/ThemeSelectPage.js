import React from "react";
import { useNavigate } from "react-router-dom";
import fantasyCard from "../../../assets/fantasy-card.png";
import businessCard from "../../../assets/business-card.png";

const themes = [
  {
    key: "fantasy",
    label: "Fantasy",
    image: fantasyCard,
    desc: "ドット絵ファンタジー世界で冒険者体験！"
  },
  {
    key: "business",
    label: "Business",
    image: businessCard,
    desc: "テクノロジー×ビジネスで成長を実感！"
  }
];

export default function ThemeSelectPage({ onSelect }) {
  const navigate = useNavigate();

  const handleSelect = (themeKey) => {
    onSelect && onSelect(themeKey);
    navigate("/job-select"); // ←テーマ選択後にジョブ選択ページへ
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#1c2024"
    }}>
      <h1 style={{
        color: "#fff",
        marginBottom: 32,
        fontSize: "2.4em",
        letterSpacing: "0.05em"
      }}>
        Choose Your Theme
      </h1>
      <div style={{
        display: "flex",
        gap: "48px"
      }}>
        {themes.map((theme) => (
          <button
            key={theme.key}
            onClick={() => handleSelect(theme.key)}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              outline: "none"
            }}
          >
            <img
              src={theme.image}
              alt={theme.label}
              style={{
                width: 220,
                height: 220,
                objectFit: "cover",
                borderRadius: 10,
                boxShadow: "0 4px 24px #0008, 0 1.5px 0.5px #8884",
                marginBottom: 16
              }}
            />
            <span style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.3em",
              letterSpacing: "0.07em",
              marginBottom: 6
            }}>{theme.label}</span>
            <span style={{
              color: "#dedede",
              fontSize: "1em",
              textAlign: "center",
              maxWidth: 180
            }}>{theme.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
