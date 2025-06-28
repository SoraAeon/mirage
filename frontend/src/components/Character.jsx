// components/Character.jsx
import React, { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useLoader, useFrame } from '@react-three/fiber'
import tankImg from '../assets/character/tank.png'

export default function Character() {
  const ref = useRef()
  const texture = useLoader(THREE.TextureLoader, tankImg)

  const material = useMemo(() => new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  }), [texture])

  const [t, setT] = useState(0)

  useFrame(() => {
    // アニメーション時間（ラフに loop）
    setT((prev) => (prev + 0.05) % (2 * Math.PI))

    // sinカーブでふわっと浮く（回転中風アニメ）
    const bounceY = Math.abs(Math.sin(t)) * 0.3

    if (ref.current) {
      ref.current.position.set(0, 2 + bounceY, -1) // Yが上下に変動
    }
  })

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
