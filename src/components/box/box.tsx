import { createElement } from 'react';

import { Color } from 'three';

function Box(props) {

  const { material={}, object={}, ...otherProps } = props || {};

  const { color, ...otherMaterial } = material;

  return (
    <mesh
      {...object}
      {...otherProps}
    >
      <boxGeometry />
      <meshStandardMaterial color={new Color(color)} {...otherMaterial} />
    </mesh>
  )
}

export default Box;


