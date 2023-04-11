import { createElement  } from 'react';

import { Color } from 'three'

function Sphere(props) {

  const { color } = props || {};

  return (
    <mesh
      {...props}
    >
      <sphereGeometry  />
      <meshStandardMaterial color={new Color(color)} />
    </mesh>
  )
}

export default Sphere;


