import { proxy } from 'valtio'

const state = proxy({
  cameraPos: [2580, 1525, -3343]
})

export { state }
