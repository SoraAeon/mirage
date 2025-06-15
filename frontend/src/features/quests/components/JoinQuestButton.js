import React, { useState } from 'react';

function JoinQuestButton({ questId }) {
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    // MVPなら“JOIN”もクリア報告APIで達成記録にする
    fetch('/api/quests/achievements/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quest: questId, comment: "挑戦します！" })
    }).then(() => setJoined(true));
  };

  return (
    <span>
      {joined ? (
        <span>挑戦中！</span>
      ) : (
        <button onClick={handleJoin}>やる！</button>
      )}
      {/* クリア報告も一緒にしたい場合は下にフォームを出す */}
    </span>
  );
}

export default JoinQuestButton;
