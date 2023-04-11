/* eslint-disable react/no-unknown-property */
import React, { Suspense, useState, createElement, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { TransformControls, useCursor, OrbitControls } from '@react-three/drei';

import { PerspectiveCamera, Color } from 'three';

import './index.scss';
import { Loading } from '@alifd/next';

let lastChildren;

const modes = ['translate', 'rotate', 'scale'];

function CustomScene(props) {
  const { children, background, ...otherProps } = props || {};
  const { scene } = useThree();
  const backgroundColor = new Color(background);
  scene.background = backgroundColor;
  return <scene {...otherProps}>
    { children || null }
  </scene>
}

const Content = (props) => {

  const canvasRef = useRef();
  const { children, getNode, designMode, componentId, background, editorCamera = {
    position: [0, 12, 30]
  } } =
    props || {};
  lastChildren = children;
  const pageNode = designMode === 'design' ? getNode(componentId) : null;
  const [target, setTarget] = useState();
  const [camera, setCamera] = useState(new PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000));
  const [hovered, setHovered] = useState(false);
  const [transformMode, setTransformMode] = useState(0);
  useCursor(hovered);
  const _children = [];
  
  React.Children.map(children, (child) => {
    if (child.type !== 'div') {
      const overrideProps: any = {
        onClick: (event) => {
          // console.log('event: ', event);
          let _target = event.object;
          while (_target.parent && !_target.componentId) {
            _target = _target.parent;
          }
          const node = getNode(_target?.componentId);
          node.select();
          setTarget(_target);
        },
        onPointerOver: () => setHovered(true),
        onPointerOut: () => setHovered(false),
        onContextMenu: (e) => {
          e.stopPropagation();
          setTransformMode((transformMode + 1) % modes.length);
        },
      };

      if (!child?.type?.isLight) {
        overrideProps.castShadow = true;
      }
      const _child = React.cloneElement(child, overrideProps);
      _children.push(_child);
    }
  });
  

  useEffect(() => {
    camera.position.fromArray(editorCamera?.position || [0, 12, 30]);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld(true);
    setCamera(camera)
  }, [camera, editorCamera])

  const onEnd = React.useMemo(() => {
    return (e) => {
      if (!pageNode) return;
      pageNode.setPropValue('editorCamera', {
        position: e?.target?.object.position?.toArray?.()
      });
      // pageNode.children?.get(0)?.select()
      pageNode.document.selection.clear();
      pageNode.select();
    }
  }, [pageNode]);
  return <Canvas
    ref={canvasRef}
    className="threeDPage"
    camera={camera}
    shadows
    onPointerMissed={() => setTarget(null)}
  >
    <CustomScene background={background}>
      <gridHelper args={[30]} />
      {_children}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0, 'XYZ']}>
        <planeGeometry args={[30, 30, 10, 10]} />
        <meshStandardMaterial color={new Color(background)}/>
      </mesh>

      <OrbitControls
        makeDefault
        enableDamping={false}
        onEnd={onEnd}
      />
      {designMode === 'design' && target ? (
        <TransformControls
          object={target}
          mode={modes[transformMode]}
          onChange={() => {
            const node = getNode(target?.componentId);
            node.setPropValue('rotation', target.rotation.toArray());
            node.setPropValue('position', target.position.toArray());
            node.setPropValue('scale', target.scale.toArray());
          } } />
      ) : null}
    </CustomScene>
  </Canvas>;
}

const Fallback = (props) => {

  const { children, ...otherProps } = props || {};

  return <Loading fullScreen>
    <Content {...otherProps} >
      {
        children
      }
    </Content>
  </Loading>;

}

function Page(props) {

  const { children, ...otherProps } = props || {};
  
  
  return (
    <Suspense fallback={<Fallback {...otherProps} >{lastChildren}</Fallback>}>
      <Content {...otherProps} >
        {
          children
        }
      </Content>
    </Suspense>
  );
}

const DirectionalLight = (props) => {

  return <directionalLight {...props} />;
}

DirectionalLight.isLight = true;

const AmbientLight = (props) => {
  return <ambientLight {...props} />;
}

AmbientLight.isLight = true;

export { Page, DirectionalLight, AmbientLight };
