import React, { useState } from 'react';

const MAP_WIDTH = 512;
const MAP_HEIGHT = 512;

const VillageMap = () => {
  // キャラ座標をstateで持つ
  const [pos, setPos] = useState({ x: 180, y: 120 });

  // マップをクリックしたとき
  const handleMapClick = e => {
    // クリック位置を計算（親divの左上からの座標）
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 24; // 24はキャラの中心調整
    const y = e.clientY - rect.top - 24;
    setPos({ x, y });
  };

  return (
    <div
      style={{
        position: 'relative',
        width: MAP_WIDTH,
        height: MAP_HEIGHT,
        cursor: 'pointer',
      }}
      onClick={handleMapClick}
    >
      {/* 背景 */}
      <img
        src="/developer_village_bg.png"
        alt="開発者の村"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 16,
          boxShadow: '0 4px 16px #0005'
        }}
      />
      {/* キャラ */}
      <img
        src="/avatar_sora.png" // さっきのアバターのファイル名
        alt="キャラ"
        style={{
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: 48,
          height: 48,
          userSelect: 'none',
          pointerEvents: 'none' // キャラをクリックしてもマップクリックが発火するように
        }}
      />
    </div>
  );
};

export default VillageMap;
