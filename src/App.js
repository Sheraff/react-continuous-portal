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
  const [side, setSide] = useState([0,0])
  const onClick = () => {
    // pick a random receptacle to display the `fragment` in
    setSide(([_i, _j]) => {
      let i, j
      do {
        i = Math.floor(Math.random() * 3)
        j = Math.floor(Math.random() * 2)
      } while (i === _i && j === _j)
      return [i, j]
    })
  }
  return (
    <>
      <button onClick={onClick}>
        move somewhere else in DOM
      </button>
      <ul className="grid">
        {/* make many receptacles */}
        {[0, 1, 2].map((i) => (
          [0, 1].map((j) => (
            <li key={i + '-' + j}>
              <Receptacle
                fragment={side[0] === i && side[1] === j && fragment}
                props={{ label: `${i}x${j}` }}
              />
            </li>
          ))
        ))}
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
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
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
