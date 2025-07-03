// components/StructureGroup.jsx
import React from 'react'
import Structure from './Structure'

import tree01Img from '../assets/structure/tree01.png'
import tree02Img from '../assets/structure/tree02.png'
import tree03Img from '../assets/structure/tree03.png'

export default function StructureGroup() {
  return (
    <>
      {/* Front face */}
      <Structure img={tree01Img} position={[0, 0, 2]} rotation={[-5, 0, 0.2]} />

      {/* Right face */}
      <Structure img={tree02Img} position={[-2, 0, 0]} rotation={[0, Math.PI / 10, -5]} />

      {/* Left face */}
      <Structure img={tree03Img} position={[1, 2, 0]} rotation={[0, -Math.PI / 1, 0]} />
      <Structure img={tree03Img} position={[-1, 2, 0]} rotation={[0, -Math.PI / 1, 0]} />

      {/* 他の面は必要に応じて */}
    </>
  )
}
