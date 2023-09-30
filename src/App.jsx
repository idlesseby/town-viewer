import { Canvas } from '@react-three/fiber'
import LoadingScreen from './components/LoadingScreen/LoadingScreen'
import { useSnapshot } from 'valtio'
import { state } from './data/store'
import './App.css'
import { Suspense } from 'react'
import Experience from './components/Experience'

export default function App() {
  const snap = useSnapshot(state)

  return <>
    <Canvas shadows camera={{ position: snap.cameraPos, near: 1, far:5000}} >
      <Suspense fallback={null}>
        <Experience/>
      </Suspense>
    </Canvas>

    <LoadingScreen />
  </>
}
