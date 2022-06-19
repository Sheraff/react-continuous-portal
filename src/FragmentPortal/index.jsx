import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

const fragments = document.createDocumentFragment()
const getProps = Symbol()
const setProps = Symbol()
const currentProps = Symbol()

export function useFragment(type = 'div') {
  const [fragment] = useState(() => {
    const element = document.createElement(type)
    fragments.appendChild(element)
    return element
  })

  useEffect(
    () => () => {
      fragment.parentElement?.removeChild(fragment)
    },
    [fragment],
  )

  return fragment
}

export function Receptacle({ fragment, props, type = 'div', slot }) {
  const div = useRef()

  useLayoutEffect(() => {
    if (!fragment) {
      return undefined
    }
    const receptacle = slot ? slot.current : div.current
    receptacle.appendChild(fragment)
    return () => {
      fragments.appendChild(fragment)
    }
  }, [slot, fragment])

  useLayoutEffect(() => {
    if (!fragment || fragment[currentProps]() === props) return
    fragment[setProps]?.(props)
  }, [fragment, props])

  if (!fragment) return null

  fragment[getProps] = () => props

  if (slot) return null

  const Element = type
  return <Element ref={div} />
}

export function Portal({ children, fragment }) {
  const [extraProps, setExtraProps] = useState(fragment[getProps]?.() || {})
  fragment[setProps] = setExtraProps
  fragment[currentProps] = () => extraProps
  return createPortal(
    Children.map(children, (child) => {
      if (!isValidElement(child)) return child
      return cloneElement(child, extraProps)
    }),
    fragment,
  )
}
