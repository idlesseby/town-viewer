import { Canvas } from '@react-three/fiber'
import { Grid, MapControls, PerformanceMonitor } from '@react-three/drei'
import './App.css'
import Town from './components/Town/Town'

export default function App() {

  return (
    <Canvas camera={{ position: [8, 4, 0]}}>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 0, 3]} />
      <Town/>
      <MapControls/>
    </Canvas>
  )
}
