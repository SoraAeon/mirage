import React, { useState } from 'react';

function LoginForm({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('/api/auth/token/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.auth_token) {
          setToken(data.auth_token);
          setMsg('ログイン成功');
        } else {
          setMsg('ログイン失敗');
        }
      });
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="ユーザー名" />
      <input value={password} type="password" onChange={e => setPassword(e.target.value)} placeholder="パスワード" />
      <button type="submit">ログイン</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}

export default LoginForm;
