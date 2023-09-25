import {  useThree } from '@react-three/fiber'
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import getGPSRelativePos from '../../utils/getGPSRelativePos'
import { useEffect, useState } from 'react';
import Annotation from '../Annotation/Annotation';
import { useSnapshot } from 'valtio'
import { state } from '../../data/store'

const Town = () => {
  const snap = useSnapshot(state)
  const { scene, camera } = useThree()
  const lineMaterial = new THREE.LineBasicMaterial({color: 0xFFCACA})

  const center = [8.403572990602223, 49.00595544251649] 
  const buildings = []
  const buildingsInfo = []
  const waters = []
  const greens = []
  const [mergedBuildings, setMergedBuildings] = useState()
  const [buildingsInfos, setBuildingsInfos] = useState([])
  const [mergedWaters, setMergedWaters] = useState()
  const [mergedGreens, setMergedGreens] = useState()

  useEffect(() => {
    fetch('/karlsruhe.geojson')
    .then(res => res.json())
    .then(data => {
      loadElements(data)
      setMergedBuildings(BufferGeometryUtils.mergeGeometries(buildings))
      setMergedWaters(BufferGeometryUtils.mergeGeometries(waters))
      setMergedGreens(BufferGeometryUtils.mergeGeometries(greens))
      setBuildingsInfos(buildingsInfo)
    })
  }, [])

  useEffect(() => {
    camera.position.set(...snap.cameraPos)
  },[snap.cameraPos])

  const loadElements = (data) => {
    for(let feature of data.features) {
      if(!feature['properties']) return

      let info = feature.properties
      let height
      if(info['building'] === 'shed') {
        height = 25 
      } 
      else if(info['height']) {
        height = info['height'] * 5
      }
      else if(info['building:levels'] && !info['height']) {
        height = info['building:levels'] * 25
      }
      else {
        height = 75
      }

      if(info['building']) {
        addNames(feature.geometry.coordinates, info, height)
        let shape = addObject(feature.geometry.coordinates)
        let geometry = new THREE.ExtrudeGeometry(shape, {curveSegments: 1, depth: height, bevelEnable: false})
        buildings.push(geometry)
      }

      if(info['natural'] === 'water') {
        let shape = addObject(feature.geometry.coordinates)
        let geometry = new THREE.ShapeGeometry(shape)
        waters.push(geometry)
      }

      if(info['landuse'] || info['leisure']) {
        addNames(feature.geometry.coordinates, info, height)
        let shape = addObject(feature.geometry.coordinates)
        let geometry = new THREE.ShapeGeometry(shape)
        greens.push(geometry)
      }

      if(info['highway']) {
        addRoad(feature.geometry.coordinates, info)
      }
      
    }
  }

  const addObject = (data) => {
    let shape
    let holes = []

    for(let i = 0; i<data.length; i++) {
      let coord = data[i]

      if(i === 0) {
        shape = getShape(coord, center)
      } else {
        holes.push(getShape(coord, center))
      }
    }

    for(let i = 0;i<holes.length;i++) {
      shape.holes.push(holes[i])
    }

    return shape
  }

  const addRoad = (data, info) => {
    let points = []

    for(let i=0; i<data.length;i++) {
       if(!data[0][1]) return

       let coord = data[i]

       if(coord.length != 2) return

       let position = [coord[0], coord[1]]

       position = getGPSRelativePos(position, center)

       points.push(new THREE.Vector3(position[0], 0.5, position[1]))
    }

    let geometry = new THREE.BufferGeometry().setFromPoints(points)
    geometry.rotateZ(Math.PI)

    let line = new THREE.Line(geometry, lineMaterial)
    line.info = info
    line.computeLineDistances()

    line.position.set(0,0.3,0)

    scene.add(line)
 }

  const addNames = (data, info, height) => {
    for(let i=0;i<data.length;i++) {
      if(!info['name'] ) return
      if(!info['wikipedia']) return
      if(buildingsInfo.filter(item => item.name === info['name']).length > 0) return

      let coord = data[i]

      // Temporary solution
      let oppositeCoord = coord[Math.ceil((coord.length -1) * 0.5)]
      
      let centeredCoord = [
        // Subtract the difference between the two opposite building points
        coord[0][0] - ((coord[0][0] - oppositeCoord[0]) * 0.5),
        coord[0][1] - ((coord[0][1] - oppositeCoord[1]) * 0.5)
      ]

      let position = getGPSRelativePos(centeredCoord, center)

      position = new THREE.Vector3(-position[0], height + 25, position[1])

      buildingsInfo.push({
        position: position,
        name: info['name'],
        wiki: info['wikipedia'],
      })
    }
  }

  const getShape = (points, center) => {
    let shape = new THREE.Shape()

    for(let i = 0; i<points.length; i++) {
      let position = points[i]

      position = getGPSRelativePos(position, center)

      if(i==0) {
        shape.moveTo(position[0], position[1])
      } else {
        shape.lineTo(position[0], position[1])
      }
    }

    return shape
  }

  return <>
    {buildingsInfos[0] != 0 ? buildingsInfos.map((building, i) => {
      return <Annotation key={i} name={building.name} position={building.position} wiki={building.wiki} />
    }) : null}

    <mesh castShadow geometry={mergedBuildings} rotation={[Math.PI * 2.5, Math.PI * 3, 0]}>
      <meshStandardMaterial color={0xffffff} envMapIntensity={0.9}/>
    </mesh>

    <mesh geometry={mergedWaters} position-y={-1} rotation={[Math.PI * 2.5, Math.PI * 3, 0]}>
      <meshStandardMaterial color={0x00ffff} envMapIntensity={0.9}/>
    </mesh>

    <mesh geometry={mergedGreens} position-y={-3.5} rotation={[Math.PI * 2.5, Math.PI * 3, 0]}>
      <meshStandardMaterial color={0xc1f376} envMapIntensity={0.9}/>
    </mesh>
  </>
}

export default Town