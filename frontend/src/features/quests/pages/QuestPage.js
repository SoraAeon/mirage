import React, { useEffect, useState } from 'react';
import JoinQuestButton from '../components/JoinQuestButton';
import QuestPostForm from '../components/QuestPostForm';

function QuestsPage({ token }) {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    fetch('/api/quests/quests/')
      .then(res => res.json())
      .then(setQuests);
  }, []);

  return (
    <div>
      <h1>クエスト一覧</h1>
      <ul>
        {quests.map(q => (
          <li key={q.id}>
            <strong>{q.title}</strong> - {q.description}
            <br />
            <JoinQuestButton questId={q.id} />
          </li>
        ))}
      </ul>
      <hr />
      <QuestPostForm token={token} />
    </div>
  );
}

export default QuestsPage;