import React, { useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'

import grassImg from '../assets/textures/grass.png'
import stoneImg from '../assets/textures/stone.png'
import snowImg from '../assets/textures/snow.png'
import dirtImg from '../assets/textures/dirt.png'
import lavaImg from '../assets/textures/lava.png'
import forestImg from '../assets/textures/forest.png'

export default function TerrainCube({ faceIcon }) {
  const [rightTexture, setRightTexture] = useState(null);
  const loader = new THREE.TextureLoader();

  // 右面テクスチャ生成
  useEffect(() => {
    const base = new window.Image();
    base.crossOrigin = 'anonymous';
    base.src = stoneImg;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    base.onload = () => {
      ctx.drawImage(base, 0, 0, 512, 512);
      if (faceIcon) {
        const iconImg = new window.Image();
        iconImg.crossOrigin = 'anonymous';
        iconImg.src = faceIcon;
        iconImg.onload = () => {
          ctx.drawImage(iconImg, 156, 156, 200, 200);
          setRightTexture(new THREE.CanvasTexture(canvas));
        };
        iconImg.onerror = () => setRightTexture(new THREE.CanvasTexture(canvas));
      } else {
        setRightTexture(new THREE.CanvasTexture(canvas));
      }
    };
    base.onerror = () => setRightTexture(new THREE.CanvasTexture(canvas));
  }, [faceIcon]);

  // 他の面は常に一回だけ
  const matLeft   = useMemo(() => new THREE.MeshStandardMaterial({ map: loader.load(grassImg) }), []);
  const matTop    = useMemo(() => new THREE.MeshStandardMaterial({ map: loader.load(snowImg) }), []);
  const matBottom = useMemo(() => new THREE.MeshStandardMaterial({ map: loader.load(dirtImg) }), []);
  const matBack   = useMemo(() => new THREE.MeshStandardMaterial({ map: loader.load(forestImg) }), []);
  const matFront  = useMemo(() => new THREE.MeshStandardMaterial({ map: loader.load(lavaImg) }), []);
  // 右面のマテリアルだけはstate依存（useMemoは早めに！）
  const rightMat  = useMemo(() => rightTexture ? new THREE.MeshStandardMaterial({ map: rightTexture }) : null, [rightTexture]);

  // ★ rightMat未生成の間だけreturn null（hooksの前にreturnしない！）
  if (!rightMat) return null;

  return (
    <mesh>
      <boxGeometry args={[3, 3, 3]} />
      <primitive object={rightMat}   attach="material-0" />
      <primitive object={matLeft}    attach="material-1" />
      <primitive object={matTop}     attach="material-2" />
      <primitive object={matBottom}  attach="material-3" />
      <primitive object={matBack}    attach="material-4" />
      <primitive object={matFront}   attach="material-5" />
    </mesh>
  );
}
