// components/TerrainCube.jsx
import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 画像import（Webpackに処理させる）
import grassImg from '../assets/textures/grass.png'
import stoneImg from '../assets/textures/stone.png'
import snowImg from '../assets/textures/snow.png'
import dirtImg from '../assets/textures/dirt.png'
import lavaImg from '../assets/textures/lava.png'
import forestImg from '../assets/textures/forest.png'

export default function TerrainCube({ targetRotation = [0, 0, 0] }) {
  const cubeRef = useRef()
  const loader = new THREE.TextureLoader()

  // 画像テクスチャの読み込み（useMemoで1回だけ）
  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ map: loader.load(stoneImg) }),   // right
    new THREE.MeshStandardMaterial({ map: loader.load(grassImg) }),   // left
    new THREE.MeshStandardMaterial({ map: loader.load(snowImg) }),    // top
    new THREE.MeshStandardMaterial({ map: loader.load(dirtImg) }),    // bottom
    new THREE.MeshStandardMaterial({ map: loader.load(forestImg) }),  // back
    new THREE.MeshStandardMaterial({ map: loader.load(lavaImg) }),    // front

  ], [])

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[3, 3, 3]} />
      {materials.map((mat, i) => (
        <primitive key={i} object={mat} attach={`material-${i}`} />
      ))}
    </mesh>
  )
}
