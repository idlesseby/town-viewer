import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei';
import { useRef } from 'react'

const Names = ({name, position}) => {
  const ref = useRef()

  useFrame(({ camera }) => {
    ref.current.quaternion.copy(camera.quaternion)
  })

  return (
    <Text 
      ref={ref} 
      color={0x222222} 
      position={position} 
      anchorX="center" 
      anchorY="middle" 
      fontSize={50}
      onClick={() => console.log(name)}
    >
      {name}
    </Text>
  )
}

export default Names