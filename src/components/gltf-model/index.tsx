import { createElement, forwardRef, useEffect, useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';

import { AnimationMixer, Box3, Mesh, Texture, Object3D, Vector3, MeshStandardMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

import { SkeletonUtils, GLTF } from 'three-stdlib';

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
    componentId,
    ...otherProps 
  }: any = props || {}

  const mapTexture = mapUrl ? useTexture(mapUrl) as Texture : null; 

  const gltf = useGLTF(modelUrl);
  const { scene, animations } = gltf as GLTF;

  const model = useMemo(() => {
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
        child.material = material.clone();
        if (mapTexture) {
          (child.material as MeshStandardMaterial).map = mapTexture
        }
      }
    });
    baseModel.add(_scene);
    return baseModel;
  }, [castShadow, mapTexture, receiveShadow, componentId]);


  let mixer;
  if (animations?.length && (__designMode !== 'design' || enableAnimationInEditor)) {
    mixer = new AnimationMixer( model );
    mixer.clipAction( animations[ currentAnimation || 0 ] ).play();
  }

  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta)
    }
  })

  if (defaultScale) {
    model.scale.setScalar(defaultScale)
  }

  return (
    <mesh componentId={componentId} {...otherProps} ref={ref}>
      <primitive object={model} />
    </mesh>
  );
}

export default forwardRef(GltfModel);
