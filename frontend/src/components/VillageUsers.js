import React, { useState, useEffect } from 'react';

const VillageUsers = ({ areaId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (areaId) {
      fetch(`/api/user-locations/?area=${areaId}`)
        .then(res => res.json())
        .then(data => setUsers(data));
    }
  }, [areaId]);

  return (
    <div>
      <h3>村の仲間たち</h3>
      <ul>
        {users.map(u =>
          <li key={u.user}>{u.area.name}：{u.user}</li>
        )}
      </ul>
    </div>
  );
};

export default VillageUsers;
