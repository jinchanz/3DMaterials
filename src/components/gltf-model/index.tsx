import { createElement, forwardRef, useEffect } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';

import { AnimationMixer, Box3, Mesh, Texture, Object3D, Vector3, MeshStandardMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

import { SkeletonUtils, GLTF } from 'three-stdlib';

let lastMapUrl;

function GltfModel(props = {}, ref) {

  const { 
    __designMode, 
    modelUrl, 
    defaultTransform, 
    defaultScale, 
    currentAnimation = 0, 
    enableAnimationInEditor, 
    castShadow,
    receiveShadow,
    mapUrl,
    ...otherProps 
  }: any = props || {}

  const mapTexture = mapUrl ? useTexture(mapUrl) as Texture : null; 

  const gltf = useGLTF(modelUrl);
  const { scene, animations } = gltf as GLTF;
  const baseModel = new Object3D();


  const box = new Box3( ).setFromObject( scene );
	const c = box.getCenter( new Vector3( ) );
	const size = box.getSize( new Vector3( ) );
	scene.position.set( -c.x, size.y / 2 - c.y, -c.z );

  const _scene = SkeletonUtils.clone(scene);
  _scene.traverse((child: Mesh) => {
    if (child.isMesh) {
      child.castShadow = castShadow;
      child.receiveShadow = receiveShadow;
      const { material } = child;
      if (mapTexture) {
        (material as MeshStandardMaterial).map = mapTexture
      }
    }
  });
  baseModel.add(_scene);

  let mixer;
  if (animations?.length && (__designMode !== 'design' || enableAnimationInEditor)) {
    mixer = new AnimationMixer( baseModel );
    mixer.clipAction( animations[ currentAnimation || 0 ] ).play();
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
    <mesh {...otherProps} ref={ref}>
      <primitive object={baseModel} />
    </mesh>
  );
}

export default forwardRef(GltfModel);
