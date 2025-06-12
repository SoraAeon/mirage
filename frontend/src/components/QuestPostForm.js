import React, { useState } from 'react';

function QuestPostForm() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/quests/quests/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: desc })
    })
      .then(res => res.ok ? setMsg("投稿完了！") : setMsg("投稿失敗"))
      .then(() => {
        setTitle('');
        setDesc('');
      });
  };

  return (
    <div>
      <h3>クエスト投稿</h3>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="タイトル" required />
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="説明" />
        <button type="submit">投稿</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}

export default QuestPostForm;
