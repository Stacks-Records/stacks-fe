import { useEffect, useMemo, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadFull } from 'tsparticles'
import vinylRecord from '../Images/vinyl-record.svg'

const ParticlesBackground = () => {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine)
    }).then(() => setInit(true))
  }, [])

  const options = useMemo(() => ({
    fullScreen: { enable: false },
    background: { color: { value: 'transparent' } },
    detectRetina: true,
    motion: { reduce: { value: true, factor: 4 } },
    particles: {
      number: { value: 50, density: { enable: true } },
      shape: {
        type: 'image',
        options: {
          image: { src: vinylRecord, width: 150, height: 150 }
        }
      },
      size: { value: { min: 16, max: 44 } },
      opacity: { value: { min: 0.2, max: 0.6 } },
      move: {
        enable: true,
        speed: { min: 0.4, max: 1.2 },
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'out' }
      },
      rotate: {
        value: { min: 0, max: 360 },
        direction: 'random',
        animation: { enable: true, speed: 10, sync: false }
      }
    }
  }), [])

  if (!init) return null

  return (
    <Particles
      id="login-particles"
      className="login-particles"
      options={options}
    />
  )
}

export default ParticlesBackground
