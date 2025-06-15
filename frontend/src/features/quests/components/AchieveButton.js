import React, { useState } from 'react';

function AchieveButton({ questId, token, onAchieved }) {
  const [done, setDone] = useState(false);

  const handleAchieve = () => {
    fetch('/api/quests/achievements/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ quest: questId, comment: "達成しました！" })
    }).then(res => {
      if (res.ok) {
        setDone(true);
        if (onAchieved) onAchieved();
      }
    });
  };

  return done ? <span>達成済！</span> : <button onClick={handleAchieve}>達成！</button>;
}

export default AchieveButton;
