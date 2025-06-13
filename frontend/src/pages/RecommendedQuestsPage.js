import React, { useEffect, useState } from 'react';

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
    <div>
      <h2>今日のおすすめクエスト</h2>
      {recommended.length === 0 ? (
        <p>全て達成済み！新しいクエストをお楽しみに。</p>
      ) : (
        <ul>
          {recommended.map(q => (
            <li key={q.id}>
              <strong>{q.title}</strong> <br />
              {q.description} <br />
              {/* ここに達成ボタンなど追加OK */}
            </li>
          ))}
        </ul>
      )}

      <h3>Sponsored Quest</h3>
      {sponsored.length === 0 ? (
        <p>現在スポンサー枠はありません</p>
      ) : (
        <ul>
          {sponsored.map(q => (
            <li key={q.id} style={{ color: 'orange' }}>
              <strong>{q.title} [SPONSORED]</strong><br />
              {q.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecommendedQuestsPage;
