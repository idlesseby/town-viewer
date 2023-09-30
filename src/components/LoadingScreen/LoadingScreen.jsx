import { useProgress } from '@react-three/drei'
import { useState } from 'react'
import { state } from '../../data/store'
import gsap from 'gsap'
import './LoadingScreen.css'

const LoadingScreen = () => {
  const { progress } = useProgress()

  const [intro, setIntro] = useState(true)

  const newCameraPos = [1080, 625, 0]

  return <>
    <section className={`${!intro ? 'loadingScreen-fade' : ''}`}>
      <h1 className="loadingScreen-title" >Karlsruhe</h1>
      <button 
        className='loadingScreen-button'
        disabled={progress < 100}
        onClick={() => {
          gsap.to(state.cameraPos, {...newCameraPos, duration: 3, ease: "sine.inOut"})
          setIntro(prev => !prev)
        }}
      >
        Enter Experience
      </button>
      <div className="loadingScreen-loader">
        <div 
          className="loadingScreen-progress"
          style={{
            transform: `scaleX(${progress / 100})`
          }}
        />
      </div>
    </section>
  </>
}

export default LoadingScreen