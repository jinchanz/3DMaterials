import { createElement  } from 'react';

import { Color } from 'three'

function Sphere(props) {

  const { material={}, ...otherProps } = props || {};

  const { color, ...otherMaterial } = material;

  return (
    <mesh
      {...otherProps}
    >
      <sphereGeometry  />
      <meshStandardMaterial color={new Color(color)} {...otherMaterial} />
    </mesh>
  )
}

export default Sphere;


