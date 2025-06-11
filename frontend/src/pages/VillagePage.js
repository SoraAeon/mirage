import React, { useEffect, useState } from 'react';
import VillageMap from '../components/VillageMap';
import VillageUsers from '../components/VillageUsers';
import VillageBoard from '../components/VillageBoard';

const VillagePage = () => {
  // 必要なstate
  const [areas, setAreas] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // 初回のみAPI取得
  useEffect(() => {
    fetch('/api/areas/')
      .then(res => res.json())
      .then(data => setAreas(data));
    fetch('/api/user-locations/')
      .then(res => res.json())
      .then(data => setUserLocation(data[0])); // 1人分しか返さない想定
  }, []);

  // シンプルなレイアウト
  return (
    <div>
      <h1>開発者の村</h1>
      <VillageMap areas={areas} userLocation={userLocation} />
      <VillageUsers areaId={userLocation?.area?.id} />
      <VillageBoard areaId={userLocation?.area?.id} />
    </div>
  );
};

export default VillagePage;
