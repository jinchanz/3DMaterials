import { createElement  } from 'react';

import { Color } from 'three'

function Sphere(props) {

  const { material={}, object={}, ...otherProps } = props || {};

  const { color, ...otherMaterial } = material;

  return (
    <mesh
      {...object}
      {...otherProps}
    >
      <sphereGeometry  />
      <meshStandardMaterial color={new Color(color)} {...otherMaterial} />
    </mesh>
  )
}

export default Sphere;


