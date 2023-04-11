import { createElement } from 'react';
import { useGLTF } from '@react-three/drei';

function GltfModel(props = {}) {

  const { modelUrl } = props || {}

  const gltf = useGLTF(modelUrl);
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

export default GltfModel;
