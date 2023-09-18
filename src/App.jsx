import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, MapControls } from '@react-three/drei'
import './App.css'
import Town from './components/Town/Town'

export default function App() {

  return (
    <Canvas camera={{ position: [8, 4, 0]}}>
      <ambientLight intensity={1} />
      <spotLight intensity={0.1} angle={0.1} penumbra={1} position={[10, 5, -5]} />

      <Town/>

      {/* <mesh rotation={[Math.PI * 1.5, 0, 0]} position={[0,-0.21,0]} scale={200} receiveShadow>
        <planeGeometry args={[1,1]} />
        <meshStandardMaterial color={0xC1F376}/>
      </mesh> */}

      <MapControls/>
    </Canvas>
  )
}
