import React from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three';
import * as GEOLIB from 'geolib';

const Town = () => {
  const { scene } = useThree()

  //const center = [8.40443488854024, 49.0135090929862] Karlsruhe
  const center = [8.363457824608531, 48.98510828866058] 
  const material = new THREE.MeshPhongMaterial()

  const getGeoData = () => {
    fetch('/oberreut.geojson')
    .then(res => res.json())
    .then(data => {
      //console.log(data)
      loadBuildings(data)
    })
  }

  const loadBuildings = (data) => {
    for(let feature of data.features) {
      if(!feature['properties']) return

      if(feature.properties['building']) {
        addBuilding(feature.geometry.coordinates, feature.properties, feature.properties['building:levels'])
      }
    }
  }

  const addBuilding = (data, info, height=1) => {
    for(let i = 0; i<data.length; i++) {
      let coord = data[i]

      let shape = getShape(coord, center)
      let geometry = getGeometry(shape, {curveSegments: 1, depth: 0.05 * height, bevelEnable: false})

      geometry.rotateX(Math.PI * 1.5)
      //geometry.rotateX(Math.PI / 2)

      let mesh = new THREE.Mesh(geometry, material)

      scene.add(mesh)
    }
  }

  const getShape = (points, center) => {
    let shape = new THREE.Shape()

    for(let i = 0; i<points.length; i++) {
      let position = points[i]

      position = GPSRelativePos(position, center)

      if(i==0) {
        shape.moveTo(position[0], position[1])
      } else {
        shape.lineTo(position[0], position[1])
      }
    }

    return shape
  }

  const getGeometry = (shape, config) => {
    let geometry = new THREE.ExtrudeGeometry(shape, config)
    geometry.computeBoundingBox()

    return geometry
  }

  const GPSRelativePos= (objPos, centerPos) => {

    // Get GPS distance
    let dis = GEOLIB.getDistance(objPos, centerPos)

    // Get bearing angle
    let bearing = GEOLIB.getRhumbLineBearing(objPos, centerPos)

    // Calculate X by centerPos.x + distance * cos(rad)
    let x = centerPos[0] + (dis * Math.cos(bearing * Math.PI / 180))

    // Calculate Y by centerPos.x + distance * sin(rad)
    let y = centerPos[1] + (dis * Math.sin(bearing * Math.PI / 180))

    // Reverse X
    return [-x/25, y/25]
  }

  return getGeoData()
}

export default Town