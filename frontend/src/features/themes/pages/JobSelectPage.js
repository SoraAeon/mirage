import React from "react";
import tankImg from "../../../assets/tank.png";
import healerImg from "../../../assets/healer.png";
import mageImg from "../../../assets/mage.png";
import assassinImg from "../../../assets/assassin.png";

const jobs = [
  {
    key: "tank",
    label: "Tank",
    image: tankImg,
    desc: "守備と耐久に優れる冒険の要。"
  },
  {
    key: "healer",
    label: "Healer",
    image: healerImg,
    desc: "回復・サポートでみんなを支える。"
  },
  {
    key: "mage",
    label: "Mage",
    image: mageImg,
    desc: "魔法と知識で戦う遠距離スペシャリスト。"
  },
  {
    key: "assassin",
    label: "Assassin",
    image: assassinImg,
    desc: "素早さと一撃必殺のアタッカー。"
  }
];

export default function JobSelectPage({ selectedTheme, onSelect }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#14181e"
    }}>
      <h1 style={{
        color: "#fff",
        marginBottom: 32,
        fontSize: "2.1em",
        letterSpacing: "0.05em"
      }}>
        Choose Your Job {selectedTheme && `(${selectedTheme.toUpperCase()})`}
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "36px",
        }}
      >
        {jobs.map((job) => (
          <button
            key={job.key}
            onClick={() => onSelect && onSelect(job.key)}
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
              src={job.image}
              alt={job.label}
              style={{
                width: 180,
                height: 180,
                objectFit: "cover",
                borderRadius: 24,
                boxShadow: "0 2px 12px #0007",
                marginBottom: 10
              }}
            />
            <span style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.1em",
              marginBottom: 4,
              letterSpacing: "0.08em"
            }}>{job.label}</span>
            <span style={{
              color: "#ccc",
              fontSize: "0.95em",
              textAlign: "center",
              maxWidth: 160
            }}>{job.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}