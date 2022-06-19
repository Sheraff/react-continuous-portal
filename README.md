# react-continuous-portal


https://user-images.githubusercontent.com/1325721/174495942-7649f246-332c-464b-80bc-7ad5cd1f6510.mov

Easy to use `createPortal` component (`<Portal/>`) that never unmounts when changing the destination (`<Receptacle/>`). Plus, even the destination can pass props.

```jsx
function() {
  const fragment = useFragment('div')
  return (
    <>
      <Portal fragment={fragment}>
        <video src="" />
      </Portal>
      <Receptacle fragment={fragment} />
    </>
  )
}
```
