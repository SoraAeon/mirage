import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

import grassImg from '../assets/textures/grass.png'
import stoneImg from '../assets/textures/stone.png'
import snowImg from '../assets/textures/snow.png'
import dirtImg from '../assets/textures/dirt.png'
import lavaImg from '../assets/textures/lava.png'
import forestImg from '../assets/textures/forest.png'

export default function TerrainCube({ rightFaceIcon }) {
  const loader = new THREE.TextureLoader();

  // カスタム：右面だけ地形＋アイコンを合成
  const rightTexture = useMemo(() => {
    // 地形画像ロード
    const base = new window.Image();
    base.src = stoneImg;

    // カードアイコンロード（右面用。なければ地形のみ）
    const icon = new window.Image();
    icon.src = rightFaceIcon || '';

    // Canvasに合成
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 描画ロジック
    return new Promise((resolve) => {
      // 地形→アイコンの順に描く
      base.onload = () => {
        ctx.drawImage(base, 0, 0, 512, 512);
        if (rightFaceIcon) {
          icon.onload = () => {
            // アイコン中央に小さめで
            ctx.drawImage(icon, 156, 156, 200, 200);
            resolve(new THREE.CanvasTexture(canvas));
          };
          icon.onerror = () => resolve(new THREE.CanvasTexture(canvas));
        } else {
          resolve(new THREE.CanvasTexture(canvas));
        }
      };
    });
  }, [rightFaceIcon]);

  // 他の面はそのまま
  const matLeft = useMemo(() => new THREE.MeshStandardMaterial({ map: loader.load(grassImg) }), []);
  const matTop = useMemo(() => new THREE.MeshStandardMaterial({ map: loader.load(snowImg) }), []);
  const matBottom = useMemo(() => new THREE.MeshStandardMaterial({ map: loader.load(dirtImg) }), []);
  const matBack = useMemo(() => new THREE.MeshStandardMaterial({ map: loader.load(forestImg) }), []);
  const matFront = useMemo(() => new THREE.MeshStandardMaterial({ map: loader.load(lavaImg) }), []);

  // rightTextureがPromiseなので、Stateで管理する例
  const [rightMat, setRightMat] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    rightTexture.then(tex => {
      if (!cancelled) setRightMat(new THREE.MeshStandardMaterial({ map: tex }));
    });
    return () => { cancelled = true };
  }, [rightTexture]);

  // rightMatが未生成の間はCube出さない（ちらつき防止）
  if (!rightMat) return null;

  return (
    <mesh>
      <boxGeometry args={[3, 3, 3]} />
      <primitive object={rightMat} attach="material-0" />
      <primitive object={matLeft}  attach="material-1" />
      <primitive object={matTop}   attach="material-2" />
      <primitive object={matBottom} attach="material-3" />
      <primitive object={matBack}  attach="material-4" />
      <primitive object={matFront} attach="material-5" />
    </mesh>
  );
}
