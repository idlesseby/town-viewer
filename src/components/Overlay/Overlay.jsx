import { useState } from 'react'
import { state } from '../../data/store'
import gsap from 'gsap'
import './Overlay.css'

const Overlay = () => {
  const [intro, setIntro] = useState(true)

  const newCameraPos = [1080, 625, 0]

  return <>
    {intro &&
      <section>
        <h1 className='intro-title'>Karlsruhe</h1>
        <button className='intro-button' onClick={() => {
          gsap.to(state.cameraPos, {...newCameraPos, duration: 2})
          setIntro(prev => !prev)
        }}>
          Enter Experience
        </button>
      </section>
    }
  </>
}

export default Overlay