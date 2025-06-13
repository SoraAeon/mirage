import React from 'react';
import parchment from '../assets/parchment.png'; // assetsに保存した場合
import './QuestCard.css';

function QuestCard({ quest, sponsored }) {
  return (
    <div
      className={`quest-card${sponsored ? " sponsored" : ""}`}
      style={{
        backgroundImage: `url(${parchment})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: '#f8eed3'
      }}
    >
      <h3 className="quest-title">
        {quest.title}
        {sponsored && <span className="quest-sponsored-label">王室依頼書</span>}
      </h3>
      <p className="quest-desc">{quest.description}</p>
    </div>
  );
}

export default QuestCard;
