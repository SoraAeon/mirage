import React, { useState, useEffect } from 'react';

const VillageBoard = ({ areaId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // 投稿を取得
  useEffect(() => {
    if (areaId) {
      fetch(`/api/messages/?area=${areaId}`)
        .then(res => res.json())
        .then(data => setMessages(data));
    }
  }, [areaId]);

  // 投稿送信
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/messages/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 認証していればトークンも必要
      },
      body: JSON.stringify({ area: areaId, content }),
    });
    setContent('');
    setLoading(false);
    // 再読み込み
    fetch(`/api/messages/?area=${areaId}`)
      .then(res => res.json())
      .then(data => setMessages(data));
  };

  return (
    <div>
      <h3>村の掲示板</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="メッセージを入力"
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading || !content}>投稿</button>
      </form>
      <ul>
        {messages.map(msg => (
          <li key={msg.id}>
            <strong>{msg.user_name}：</strong>
            {msg.content}
            <span style={{ fontSize: '0.8em', color: '#888' }}>
              {' '}({new Date(msg.created_at).toLocaleString()})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VillageBoard;
