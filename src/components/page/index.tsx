/* eslint-disable react/no-unknown-property */
import React, { Suspense, useState, createElement, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { TransformControls, useCursor, useHelper } from '@react-three/drei';

import { PerspectiveCamera, DirectionalLight, DirectionalLightHelper, Color } from 'three';

import { OrbitControls } from '../../utils/OrbitControls';

import './index.scss';

const modes = ['translate', 'rotate', 'scale'];

const Light = () => {
  const dirLight = useRef<DirectionalLight>(null);
  useHelper(dirLight, DirectionalLightHelper, 1, 'red');

  return (
    <directionalLight
      ref={dirLight}
      position={[10, 10, 10]}
      intensity={1.5}
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-far={50}
      castShadow
      shadow-camera-left={-100}
      shadow-camera-right={100}
      shadow-camera-top={100}
      // eslint-disable-next-line react/no-unknown-property
      shadow-camera-bottom={-100}
    />
  );
};

function CustomScene(props) {
  const { children, background, ...otherProps } = props || {};
  const { scene } = useThree();
  const backgroundColor = new Color(background);
  scene.background = backgroundColor;
  return <scene {...otherProps}>
    { children || null }
  </scene>
}

function Page(props) {
  const canvasRef = useRef();
  const { children, getNode, designMode, componentId, background } =
    props || {};
  const pageNode = designMode === 'design' ? getNode(componentId) : null;
  const [target, setTarget] = useState();
  const [hovered, setHovered] = useState(false);
  const [transformMode, setTransformMode] = useState(0);
  useCursor(hovered);
  const _children = [];
  
  React.Children.map(children, (child) => {
    if (child.type !== 'div') {
      const _child = React.cloneElement(child, {
        onClick: (event) => {
          // console.log('event: ', event);
          let _target = event.object;
          while (_target.parent && !_target.componentId) {
            _target = _target.parent;
          }
          const { componentId } = _target;
          const node = getNode(componentId);
          node.select();
          setTarget(_target);
        },
        onPointerOver: () => setHovered(true),
        onPointerOut: () => setHovered(false),
        onContextMenu: (e) => {
          e.stopPropagation();
          setTransformMode((transformMode + 1) % modes.length);
        },
        castShadow: true,
      });
      _children.push(_child);
    }
  });
  
  const camera = new PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.fromArray([0, 12, 30]);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);
  return (
    <Canvas
      ref={canvasRef}
      className="threeDPage"
      camera={camera}
      shadows
      onPointerMissed={() => setTarget(null)}
    >
      <Suspense fallback={null}>
        <CustomScene background={background}>
          <gridHelper args={[30]} />
          {_children}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0, 'XYZ']}>
            <planeGeometry args={[30, 30, 10, 10]} />
            <meshStandardMaterial color={new Color(background)}/>
          </mesh>
          <ambientLight />
          <Light />

          <OrbitControls
            makeDefault
            onEnd={(e) => {
              if (!pageNode) return;
              pageNode.setPropValue('cameraPosition', e?.target?.object.position?.toArray?.());
            }}
          />
          {designMode === 'design' && target ? (
            <TransformControls
              object={target}
              mode={modes[transformMode]}
              onChange={() => {
                const { componentId } = target;
                const node = getNode(componentId);
                node.setPropValue('rotation', target.rotation.toArray());
                node.setPropValue('position', target.position.toArray());
                node.setPropValue('scale', target.scale.toArray());
              } } />
          ) : null}
        </CustomScene>
      </Suspense>
    </Canvas>
  );
}

export default Page;
