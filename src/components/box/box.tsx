import { createElement } from 'react';
import { Color } from 'three'

function Box(props) {
  const { color } = props || {};

  return (
    <mesh
      {...props}
    >
      <boxGeometry />
      <meshStandardMaterial color={new Color(color)} />
    </mesh>
  )
}

export default Box;


