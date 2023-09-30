import { useEffect, useState } from 'react';
import {  useThree } from '@react-three/fiber'
import { Environment, MapControls, Sky } from '@react-three/drei'
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

      <Environment preset='sunset'/>

      <Sky distance={30000} sunPosition={[1,1,0]}/>

      <MapControls/>

      <Town data={data}/>
    </group>
    }
  </>
}

export default Experience