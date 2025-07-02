// components/SceneController.jsx
import React, { useState } from 'react'
import Scene from './Scene'
import ChoiceCardList from './ChoiceCardList' // UIパネル（仮）想定

export default function SceneController() {
  // 進行方向（例：'front', 'left', 'right', 'back'）
  const [direction, setDirection] = useState('front')

  // キューブの回転状態（[x, y, z] in radians）
  const [rotation, setRotation] = useState([0, 0, 0])

  // 面ごとの建物情報（配列 or マップ）
  const [structures, setStructures] = useState([
    { face: 'front', img: 'house' },
    { face: 'left', img: 'tree' },
    { face: 'right', img: 'shop' },
  ])

  // カードクリック時の処理
  const handleMove = (dir) => {
    setDirection(dir)

    // キューブの回転を更新（簡単な例）
    setRotation((prev) => {
      switch (dir) {
        case 'left':
          return [prev[0], prev[1] + Math.PI / 2, prev[2]]
        case 'right':
          return [prev[0], prev[1] - Math.PI / 2, prev[2]]
        case 'back':
          return [prev[0] + Math.PI / 2, prev[1], prev[2]]
        case 'front':
          return [prev[0] - Math.PI / 2, prev[1], prev[2]]
        default:
          return prev
      }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1 }}>
        <Scene
          direction={direction}
          rotation={rotation}
          structures={structures}
        />
      </div>
      <div style={{ flex: 1 }}>
        <ChoiceCardList onChoice={handleMove} />
      </div>
    </div>
  )
}
