import { Canvas } from '@react-three/fiber'
import { Environment, MapControls, Sky } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import './App.css'
import Town from './components/Town/Town'

export default function App() {



  return (
    <Canvas shadows camera={{ position: [400, 400, 0], near: 1, far:7500}} >

      <Perf />

      <Environment preset='sunset'/>

      <Sky distance={30000} sunPosition={[1,1,0]}/>

      <Town/>

      <mesh receiveShadow scale={20000} position-y={-3} rotation-x={ -Math.PI * 0.5 }>
        <planeGeometry/>
        <meshStandardMaterial color={0xFFF6F6} envMapIntensity={0.9}/>
      </mesh>

      <MapControls/>

    </Canvas>
  )
}
