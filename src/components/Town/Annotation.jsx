import { useFrame } from '@react-three/fiber'
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useRef, useState } from 'react'
import './Annotation.css'

const Annotation = ({name, position, wiki}) => {
  const ref = useRef()

  const [isInRange, setInRange] = useState(true)
  const isVisible = isInRange

  const vec = new THREE.Vector3()

  useFrame(({ camera }) => {
    const range = camera.position.distanceTo(ref.current.getWorldPosition(vec)) <= 3000
    if (range !== isInRange) setInRange(range)
    ref.current.quaternion.copy(camera.quaternion)
  })

  return (
    <group ref={ref} position={position}>
      <Html
        scale={100}
        transform
        style={{ transition: 'all 0.3s', opacity: isVisible ? 1 : 0, transform: `scale(${isVisible ? 1 : 0.25})`}}
      >
        <div className='container' onClick={() => console.log(wiki)}>
          <p>{name}</p>
        </div>
      </Html>
    </group>
  )
}

export default Annotation