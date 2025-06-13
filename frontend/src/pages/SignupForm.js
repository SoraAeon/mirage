import React, { useState } from 'react';

function SignupForm({ onSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    fetch('/api/auth/users/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    })
      .then(res => res.json())
      .then(data => {
        if (data.id || data.username) {
          setMsg('サインアップ成功！ログインしてください。');
          if (onSignup) onSignup();
        } else if (data.email || data.username || data.password) {
          setMsg('入力エラー: ' + JSON.stringify(data));
        } else {
          setMsg('サインアップ失敗');
        }
      });
  };

  return (
    <form onSubmit={handleSignup}>
      <h3>新規登録</h3>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="ユーザー名"
        required
      />
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="メールアドレス"
        required
        type="email"
      />
      <input
        value={password}
        type="password"
        onChange={e => setPassword(e.target.value)}
        placeholder="パスワード"
        required
      />
      <button type="submit">登録</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}

export default SignupForm;
