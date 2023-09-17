import { useThree } from '@react-three/fiber'
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import getGPSRelativePos from '../../utils/getGPSRelativePos'

const Town = () => {
  const { scene } = useThree()

  const buildings = []
  const center = [8.404435881088258, 49.01349645754252] 
  const buildingMaterial = new THREE.MeshPhongMaterial()
  const lineMaterial = new THREE.LineBasicMaterial({color: 0x00ffff})

  const getGeoData = () => {
    fetch('/karlsruhe.geojson')
    .then(res => res.json())
    .then(data => {
      loadElements(data)
    })
  }

  const loadElements = (data) => {
    for(let feature of data.features) {
      if(!feature['properties']) return

      let info = feature.properties

      if(info['building']) {
        addBuilding(feature.geometry.coordinates, info, info['building:levels'])
      }

      if(info['highway']) {
        addRoad(feature.geometry.coordinates, info)
      }
    }

    let mergeBuildings = BufferGeometryUtils.mergeGeometries(buildings)
    let mergedBuildings = new THREE.Mesh(mergeBuildings, buildingMaterial)

    scene.add(mergedBuildings)
  }

  const addBuilding = (data, info, height=1) => {
    let shape, geometry
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

    geometry = getGeometry(shape, {curveSegments: 1, depth: 0.15 * height, bevelEnable: false})
    geometry.rotateX(Math.PI * 1.5)
    geometry.rotateY(Math.PI * 3)

    buildings.push(geometry)
  }

  const addRoad = (data, info) => {
     let points = []

     for(let i=0; i<data.length;i++) {
        if(!data[0][1]) return

        let coord = data[i]

        if(coord.length != 2) return

        let position = [coord[0], coord[1]]

        position = getGPSRelativePos(position, center) // anstatt position einfach coord?

        points.push(new THREE.Vector3(position[0], 0.5, position[1]))
     }


     let geometry = new THREE.BufferGeometry().setFromPoints(points)
     geometry.rotateZ(Math.PI)

     let line = new THREE.Line(geometry, lineMaterial)
     line.info = info
     line.computeLineDistances()

     scene.add(line)
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

  const getGeometry = (shape, config) => {
    let geometry = new THREE.ExtrudeGeometry(shape, config)
    geometry.computeBoundingBox()

    return geometry
  }

  return getGeoData()
}

export default Town