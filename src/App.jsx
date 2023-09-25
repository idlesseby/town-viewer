import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, MapControls, Sky } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import Town from './components/Town/Town'
import Overlay from './components/Overlay/Overlay'
import { useSnapshot } from 'valtio'
import { state } from './data/store'
import './App.css'

export default function App() {
  const snap = useSnapshot(state)

  return <>
    <Canvas shadows camera={{ position: snap.cameraPos, near: 1, far:10000}} >

      <Perf />

      <Environment preset='sunset'/>

      <Sky distance={30000} sunPosition={[1,1,0]}/>

      <Town/>
      <mesh receiveShadow scale={20000} position-y={-5} rotation-x={ -Math.PI * 0.5 }>
        <planeGeometry/>
        <meshStandardMaterial color={0xFFF6F6} envMapIntensity={0.9}/>
      </mesh>

      <MapControls/>

    </Canvas>

    <Overlay/>
  </>
}
