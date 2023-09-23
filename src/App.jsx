import { Canvas } from '@react-three/fiber'
import { MapControls } from '@react-three/drei'
import './App.css'
import Town from './components/Town/Town'

export default function App() {

  return (
    <Canvas shadows camera={{ position: [400, 400, 0], near: 1, far:7500}} >

      <ambientLight intensity={0.5} color={0xFFF6F6}/>
      <pointLight intensity={100000000} color={0xFFF6F6} position={[20,5000,10]}/>

      <color attach="background" args={[0xFFF6F6]} />

      <Town/>

      <MapControls/>
    </Canvas>
  )
}
