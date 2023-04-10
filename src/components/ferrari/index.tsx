import { createElement } from 'react';
import { Color } from 'three';
import { useGLTF } from '@react-three/drei';

function Ferrari(props) {
  const { color } = props || {};
  const gltf = useGLTF('/public/ferrari.glb');
  const { scene } = gltf;

  const _scent = scene.clone();

  _scent.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <mesh {...props}>
      <primitive object={_scent} />
    </mesh>
  );
}

export default Ferrari;
