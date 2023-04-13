import React, { useEffect, useState, createElement } from 'react';

import { MMDLoader } from 'three-stdlib';

const loader = new MMDLoader();

function MmdModel(props) {

  const { modelUrl } = props || {};

  const [ position,  setPosition ] = useState([])

  useEffect(() => {
    loader.load( modelUrl, ( result ) => {
      console.log('result: ', result)
      const morphTargets = result.morphTargets;
      setPosition(morphTargets);
      // const clip = result.clip;
      // // clip.optimize(); // optional
  
      // const geometry = new THREE.BoxGeometry();
      // geometry.morphAttributes.position = morphTargets; // apply morph targets
  
      // const material = new THREE.MeshNormalMaterial();
  
      // const mesh = new THREE.Mesh( geometry, material );
      // scene.add( mesh );
  
      // mixer = new THREE.AnimationMixer( mesh );
      // mixer.clipAction( clip ).play(); // use clip
  
  
    } );
  }, [modelUrl])

  if (!position?.length) return null

  return <mesh morphTargetInfluences={[]}>
    <boxGeometry morphAttributes={{position}} />
    <meshNormalMaterial />
  </mesh>;
}

export default MmdModel;
