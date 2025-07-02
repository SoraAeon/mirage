import React from "react";

// 汎用2x2グリッド
export default function FourCardGrid({ cards, renderCard }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "36px",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: 0,
        margin: "32px auto",
      }}
    >
      {cards.map((card, idx) => (
        renderCard
          ? renderCard(card, idx)
          : <div key={card.id || idx}>カード</div>
      ))}
    </div>
  );
}
