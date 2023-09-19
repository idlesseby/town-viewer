import { useThree } from '@react-three/fiber'
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import getGPSRelativePos from '../../utils/getGPSRelativePos'

const Town = () => {
  const { scene } = useThree()

  const buildings = []
  const waters = []
  const center = [8.403572990602223, 49.00595544251649] 
  const buildingMaterial = new THREE.MeshPhongMaterial()
  const waterMaterial = new THREE.MeshPhongMaterial({color: 0x00ffff})
  const lineMaterial = new THREE.LineBasicMaterial({color: 0xffce3f})

  const getGeoData = () => {
    fetch('/karlsruhe2.geojson')
    .then(res => res.json())
    .then(data => {
      loadElements(data)
    })
  }

  const loadElements = (data) => {
    for(let feature of data.features) {
      if(!feature['properties']) return

      let info = feature.properties
      let height = info['building:levels'] ? info['building:levels'] : 1

      if(info['building']) {
        let shape = addObject(feature.geometry.coordinates)
        let geometry = new THREE.ExtrudeGeometry(shape, {curveSegments: 1, depth: 25 * height, bevelEnable: false})
        geometry.computeBoundingBox()
        geometry.rotateX(Math.PI * 1.5)
        geometry.rotateY(Math.PI * 3)

        buildings.push(geometry)
      }

      if(info['natural'] === 'water') {
        let shape = addObject(feature.geometry.coordinates)
        let geometry = new THREE.ShapeGeometry(shape)
        geometry.computeBoundingBox()
        geometry.rotateX(Math.PI * 1.5)
        geometry.rotateY(Math.PI * 3)

        waters.push(geometry)
      }

      if(info['highway']) {
        addRoad(feature.geometry.coordinates, info)
      }
    }

    let mergeBuildings = BufferGeometryUtils.mergeGeometries(buildings)
    let mergedBuildings = new THREE.Mesh(mergeBuildings, buildingMaterial)

    let mergeWaters = BufferGeometryUtils.mergeGeometries(waters)
    let mergedWaters = new THREE.Mesh(mergeWaters, waterMaterial)
    mergedWaters.position.set(0,-0.2,0)

    scene.add(mergedBuildings, mergedWaters)
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

       position = getGPSRelativePos(position, center) // anstatt position einfach coord?

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

  return getGeoData()
}

export default Town