// components/Structure.jsx
import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'

export default function Structure({ img, position = [0, 0, 0], rotation = [0, 0, 0], size = [1, 1] }) {
  const texture = useLoader(THREE.TextureLoader, img)

  const material = useMemo(() => new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  }), [texture])

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
