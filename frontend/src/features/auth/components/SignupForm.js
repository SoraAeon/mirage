import React, { useState } from 'react';

function SignupForm({ onSignup }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    setMsg(''); // メッセージ初期化
    fetch('/api/auth/users/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
      .then(async res => {
        const data = await res.json();
        if (res.ok) {
          setMsg('サインアップ成功！ログインしてください。');
          setUsername('');
          setEmail('');
          setPassword('');
          if (onSignup) onSignup();
        } else if (data) {
          setMsg('エラー: ' + JSON.stringify(data));
        } else {
          setMsg('サインアップ失敗');
        }
      })
      .catch(() => setMsg('ネットワークエラー'));
  };

  return (
    <form onSubmit={handleSignup}>
      <h3>新規登録</h3>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="ユーザー名"
        required
      /><br />
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="メールアドレス"
        required
        type="email"
      /><br />
      <input
        value={password}
        type="password"
        onChange={e => setPassword(e.target.value)}
        placeholder="パスワード"
        required
      /><br />
      <button type="submit">登録</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}

export default SignupForm;
