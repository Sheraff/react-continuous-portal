import { useEffect, useRef, useState } from 'react'
import './styles.css'
import { useFragment, Receptacle, Portal } from './FragmentPortal'

export default function App() {
  const fragment = useFragment('div')

  return (
    <div className="App">
      <Slots fragment={fragment} />
      <LiveComponents fragment={fragment} />
    </div>
  )
}

function LiveComponents({ fragment }) {
  const [, rerender] = useState(0)
  const i = useRef(0).current++
  return (
    <Portal fragment={fragment}>
      <button onClick={() => rerender({})}>rerender: {i}</button>
      <Video />
      <Timer />
    </Portal>
  )
}

function Slots({ fragment }) {
  const [side, setSide] = useState(false)
  const onClick = () => setSide((a) => !a)
  const slotRef = useRef()
  return (
    <>
      <button onClick={onClick}>
        {!side && '←'} switch {side && '→'}
      </button>
      <ul className="grid">
        <li ref={slotRef}>
          <Receptacle
            slot={slotRef} // into ref Node
            fragment={side && fragment}
            props={{ label: 'left' }}
          />
        </li>
        <Receptacle
          type="li" // as standalone Node
          fragment={!side && fragment}
          props={{ label: 'right' }}
        />
      </ul>
    </>
  )
}

function Video({ label }) {
  const i = useRef(0).current++
  return (
    <>
      <video width="320" height="240" controls loop muted autoPlay playsInline>
        <source
          src="https://www.w3docs.com/build/videos/arcnet.io(7-sec).mp4"
          type="video/mp4"
        />
      </video>
      <div>
        renders: {i}, parent: {label}
      </div>
    </>
  )
}

function Timer({ label }) {
  const [time, setTime] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTime((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const i = useRef(0).current++
  return (
    <p>
      {time}s since mounted, renders: {i}, parent: {label}
    </p>
  )
}
