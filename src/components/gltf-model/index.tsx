import { createElement } from 'react';
import { useGLTF } from '@react-three/drei';

import { AnimationMixer, Box3, Object3D, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

function GltfModel(props = {}) {

  const { modelUrl, defaultTransform, defaultScale, __designMode, ...otherProps } = props || {}

  const gltf: GLTF = useGLTF(modelUrl);
  const { scene, animations } = gltf;
  const baseModel = new Object3D();


  const box = new Box3( ).setFromObject( scene );
	const c = box.getCenter( new Vector3( ) );
	const size = box.getSize( new Vector3( ) );
	scene.position.set( -c.x, size.y / 2 - c.y, -c.z );

  const _scene = scene.clone(true);
  _scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  baseModel.add(_scene);

  let mixer;
  if (animations?.length && __designMode !== 'design') {
    mixer = new AnimationMixer( baseModel );
    mixer.clipAction( animations[ 0 ] ).play();
  }

  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta)
    }
  })

  if (defaultScale) {
    baseModel.scale.setScalar(defaultScale)
  }

  return (
    <mesh {...otherProps}>
      <primitive object={baseModel} />
    </mesh>
  );
}

export default GltfModel;
