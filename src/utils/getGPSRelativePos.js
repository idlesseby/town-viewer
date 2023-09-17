import * as GEOLIB from 'geolib';

export default function getGPSRelativePos(objPos, centerPos) {
  // Get GPS distance
  let dis = GEOLIB.getDistance(objPos, centerPos)

  // Get bearing angle
  let bearing = GEOLIB.getRhumbLineBearing(objPos, centerPos)

  // Calculate X by centerPos.x + distance * cos(rad)
  let x = centerPos[0] + (dis * Math.cos(bearing * Math.PI / 180))

  // Calculate Y by centerPos.x + distance * sin(rad)
  let y = centerPos[1] + (dis * Math.sin(bearing * Math.PI / 180))

  // Reverse X
  return [-x/20, y/20]
}