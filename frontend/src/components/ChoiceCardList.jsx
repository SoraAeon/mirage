// components/ChoiceCardList.jsx
import React from 'react'

export default function ChoiceCardList({ onChoice }) {
  const directions = ['front', 'left', 'right', 'back']

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      height: '100%',
      background: '#111',
      color: '#fff'
    }}>
      {directions.map((dir) => (
        <button
          key={dir}
          onClick={() => onChoice(dir)}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            background: '#333',
            border: '2px solid #888',
            borderRadius: '8px',
            cursor: 'pointer',
            color: 'white',
          }}
        >
          {dir.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
