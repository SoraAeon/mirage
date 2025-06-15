import React, { useState } from 'react';

function QuestPostForm({ token, onPosted }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // トークンがなければ投稿不可！
    if (!token) {
      setMsg('ログインが必要です');
      return;
    }

    fetch('/api/quests/quests/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ title, description: desc })
    })
      .then(async res => {
        if (res.ok) {
          setMsg('投稿完了！');
          setTitle('');
          setDesc('');
          if (onPosted) onPosted();
        } else {
          const data = await res.json();
          setMsg('投稿失敗: ' + JSON.stringify(data));
        }
      })
      .catch(() => setMsg('ネットワークエラー'));
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
