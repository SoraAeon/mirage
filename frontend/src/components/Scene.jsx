// Scene.jsx
import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
// import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Character from './Character'
import TerrainCube from './TerrainCube'
import StructureGroup from './StructureGroup'

/** 🔁 回転用の group を定義（Canvas 内で使える） */
function RotatingGroup({ rotation, children }) {
  const groupRef = useRef()

  useFrame(() => {
    if (!groupRef.current) return

    const current = groupRef.current.rotation
    const target = new THREE.Euler(...rotation)

    current.x = THREE.MathUtils.lerp(current.x, target.x, 0.1)
    current.y = THREE.MathUtils.lerp(current.y, target.y, 0.1)
    current.z = THREE.MathUtils.lerp(current.z, target.z, 0.1)
  })

  return <group ref={groupRef}>{children}</group>
}

export default function Scene({ direction, rotation, structures }) {
  return (
    <Canvas style={{ width: '100%', height: '100%', background: '#14181e' }}
      camera={{ position: [-5, 5, 5], fov: 50 }}
      >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      {/* <OrbitControls /> */}

      {/* 🔁 ここが動く */}
      <RotatingGroup rotation={rotation}>
        <TerrainCube />
        <StructureGroup structures={structures} />
      </RotatingGroup>

      {/* 🧍 キャラは固定 */}
      <Character />
    </Canvas>
  )
}
