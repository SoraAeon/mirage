import React from 'react';

const VillageMap = ({ areas, userLocation }) => (
  <div>
    <h2>村マップ</h2>
    <ul>
      {areas.map(area => (
        <li key={area.id} style={{
          fontWeight: userLocation?.area?.id === area.id ? 'bold' : 'normal',
          color: userLocation?.area?.id === area.id ? 'blue' : 'black'
        }}>
          {area.name}
        </li>
      ))}
    </ul>
  </div>
);

export default VillageMap;
