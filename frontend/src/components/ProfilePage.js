import React, { useEffect, useState } from 'react';

function ProfilePage({ token }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch('/api/accounts/profiles/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setProfile(data[0])); // [0]は自分だけ返す想定
  }, [token]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>プロフィール</h1>
      <p>ユーザー名: {profile.display_name}</p>
      <p>クエスト達成数: <b>{profile.achievement_count}</b></p>
      {/* 他プロフィール情報もここに */}
    </div>
  );
}

export default ProfilePage;
