import { useEffect, useState } from 'react';
import {  useThree } from '@react-three/fiber'
import { Environment, Lightformer, MapControls, Sky } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useSnapshot } from 'valtio'
import { state } from '../data/store'
import Town from './Town'

const Experience = () => {
  const snap = useSnapshot(state)
  const { camera } = useThree()

  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/karlsruhe.geojson')
    .then(res => res.json())
    .then(data => {
      setData(data)
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    camera.position.set(...snap.cameraPos)
  },[snap.cameraPos])

  return <>
    {!isLoading &&
    <group>
      <Perf />

      <Environment files="./forgotten_miniland_1k.hdr">
        <Lightformer intensity={0.75} position={[0,1,0]} scale={[1,1,1]} rotation-x={Math.PI/2} color='lightblue' />
        <Lightformer intensity={0.5} position={[0,0.5,-1]} scale={[1,1,1]} rotation-x={Math.PI/2} color='tomato' />
      </Environment>

      <Sky distance={35000} sunPosition={[1,1,0.5]}/>

      <MapControls/>

      <Town data={data}/>
    </group>
    }
  </>
}

export default Experience