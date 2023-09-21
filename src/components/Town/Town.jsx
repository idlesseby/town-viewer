import { useThree } from '@react-three/fiber'
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import getGPSRelativePos from '../../utils/getGPSRelativePos'
import { useEffect, useState } from 'react';
import Names from './Names';

const Town = () => {
  const { scene } = useThree()
  const lineMaterial = new THREE.LineBasicMaterial({color: 0xffce3f})

  const center = [8.403572990602223, 49.00595544251649] 
  const buildings = []
  const buildingPos = []
  const buildingNames = []
  const waters = []
  const greens = []
  const [mergedBuildings, setMergedBuildings] = useState()
  const [buildingsPos, setBuildingsPos] = useState([])
  const [buildingsName, setBuildingsName] = useState([])
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
      setBuildingsPos(buildingPos)
      setBuildingsName(buildingNames)
    })
  }, [])

  const loadElements = (data) => {
    for(let feature of data.features) {
      if(!feature['properties']) return

      let info = feature.properties
      let height = info['building:levels'] ? info['building:levels'] * 25 : 50

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
    for(let i=0; i<data.length;i++) {
      if(!info['name']) return

      let coord = data[i]

      let position = getGPSRelativePos(coord[0], center)

      position = new THREE.Vector3(-position[0], height + 100, position[1])
      
      buildingPos.push(position)
      buildingNames.push(info['name'])
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
    {buildingsName[0] != 0 ? buildingsName.map((building, i) => {
      return <Names key={i} name={building} position={buildingsPos[i]} />
    }) : null}

    <mesh geometry={mergedBuildings} rotation={[Math.PI * 2.5, Math.PI * 3, 0]}>
      <meshPhongMaterial color={0xFFFAFA} />
    </mesh>

    <mesh geometry={mergedWaters} position={[0,-0.2,0]} rotation={[Math.PI * 2.5, Math.PI * 3, 0]}>
      <meshPhongMaterial color={0x00ffff} />
    </mesh>

    <mesh geometry={mergedGreens} position={[0,-0.5,0]} rotation={[Math.PI * 2.5, Math.PI * 3, 0]}>
      <meshPhongMaterial color={0xc1f376} />
    </mesh>
  </>
}

export default Town