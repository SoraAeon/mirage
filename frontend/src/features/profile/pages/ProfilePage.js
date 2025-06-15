import React, { useEffect, useState } from 'react';

function ProfilePage({ token }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch('/api/accounts/profiles/', {
      headers: {
        'Authorization': `Token ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => setProfile(data[0])); // 配列の最初の要素（自分のプロフィール）
  }, [token]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>プロフィール</h1>
      <p>ユーザー名: {profile.username}</p>
      <p>表示名: {profile.display_name}</p>
      <p>クエスト達成数: <b>{profile.achievement_count}</b></p>
    </div>
  );
}

export default ProfilePage;
