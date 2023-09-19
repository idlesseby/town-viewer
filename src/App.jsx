import { Canvas } from '@react-three/fiber'
import { MapControls } from '@react-three/drei'
import './App.css'
import Town from './components/Town/Town'

export default function App() {

  return (
    <Canvas shadows camera={{ position: [120, 100, 0], near: 1, far:5000}} >

      <ambientLight intensity={0.5} color={0xfafafa}/>
      <pointLight intensity={100000000} color={0xfafafa} position={[20,5000,10]}/>

      <color attach="background" args={[0x222222]} />

      <Town/>

      {/* <mesh rotation={[Math.PI * 1.5, 0, 0]} position={[0,-0.21,0]} scale={200} receiveShadow>
        <planeGeometry args={[1,1]} />
        <meshStandardMaterial color={0xc1f376}/>
      </mesh> */}

      <MapControls/>
    </Canvas>
  )
}
