import React, { useEffect, useState } from 'react';
import QuestCard from '../components/QuestCard';
import boardBg from '../assets/quest-board-bg.png';
import '../components/RecommendedQuestsPage.css';

function RecommendedQuestsPage({ token }) {
  const [recommended, setRecommended] = useState([]);
  const [sponsored, setSponsored] = useState([]);
  const [loading, setLoading] = useState(true);

  // おすすめAPIからデータ取得
  useEffect(() => {
    setLoading(true);
    fetch('/api/quests/recommended/', {
      headers: { 'Authorization': `Token ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setRecommended(data.recommended || []);
        setSponsored(data.sponsored || []);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div>Loading...</div>;

  return (
    <div
      style={{
        backgroundImage: `url(${boardBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        minWidth: '100vw',
        paddingTop: '48px',
      }}
      className="quest-board-container"
    >
      <h1 className="quest-board-title">Quest</h1>
      <div className="quest-list">
        {/* Questカード3枚まで */}
        {recommended.slice(0, 3).map(q => (
          <QuestCard key={q.id} quest={q} />
        ))}

        {/* Sponsoredカード1枚だけ（あれば） */}
        {sponsored.length > 0 && (
          <QuestCard key={'sponsored-' + sponsored[0].id} quest={sponsored[0]} sponsored />
        )}
      </div>
    </div>
  );
}

export default RecommendedQuestsPage;