/* eslint-disable react/no-unknown-property */
import React, { Suspense, useState, createElement, useRef, useMemo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useCursor, OrbitControls } from '@react-three/drei';

import { PerspectiveCamera, Color, EquirectangularReflectionMapping, Vector3, DoubleSide } from 'three';

import { RGBELoader } from 'three-stdlib';

import { TransformControls } from '../../utils/TransformControls';

import './index.scss';
import { Loading } from '@alifd/next';

let lastChildren;

// 记录当前被操控的对象，当切换选择对象时，调用 detach 方法释放操控
let currentTransformControlTarget;

const modes = ['translate', 'rotate', 'scale'];

function CustomScene(props) {
  const { children, background, backgroundType, texture, ...otherProps } = props || {};
  const { gl, scene: sceneInst, setSize, camera } = useThree();
  const [environment, setEnvironment] = useState();

  useEffect(() => {
    if (texture) {
      new RGBELoader()
        .setPath( '/public/textures/' )
        .load( texture, ( hdrEquirect ) => {
          hdrEquirect.mapping = EquirectangularReflectionMapping;
          setEnvironment(hdrEquirect)
        });
    }
  }, [texture])

  useEffect(() => {
    window.onresize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);
      setSize(window.innerWidth, window.innerHeight)
      gl.render(sceneInst, camera)
    };
    return () => {
      window.onresize = null;
    }
  }, [camera, gl, sceneInst, setSize])


  if (environment) {
    sceneInst.environment = environment;
  }
  if (backgroundType === 'color') {
    const backgroundColor = new Color(background);
    sceneInst.background = backgroundColor;
  } else if (backgroundType === 'texture' && environment) {
    sceneInst.background = environment;
  }

  return <scene {...otherProps}>
    { children || null }
  </scene>
}

const Content = (props) => {

  const canvasRef = useRef();
  const { children, getNode, __designMode, componentId, background, camera: cameraProps = {
    position: [0, 8, 30]
  }, backgroundType, texture } =
    props || {};
  lastChildren = children;
  const pageNode = __designMode === 'design' ? getNode(componentId) : null;
  let [target, setTarget] = useState();
  const [hovered, setHovered] = useState(false);
  const [transformMode, setTransformMode] = useState(0);
  useCursor(hovered);
  const _children = [];
  
  React.Children.map(children, (child) => {
    if (child.type !== 'div') {
      const overrideProps = {
        
      };
      if (__designMode === 'design') {
        Object.assign(overrideProps, {
          onClick: (event) => {
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
        })
      }
      if (!child.type.isLight) {
        overrideProps.castShadow = true;
      }
      const _child = React.cloneElement(child, overrideProps);
      _children.push(_child);
    }
  });
  
  const defaultCamera = React.useMemo(() => new PerspectiveCamera(cameraProps.fov || 25, window.innerWidth / window.innerHeight, 0.1, 2000), [cameraProps] )
  
  const [camera, setCamera] = useState(defaultCamera);

  React.useEffect(() => {
    camera.position.fromArray(cameraProps?.position || [0, 8, 30]);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld(true);
    setCamera(camera);

    return () => {
      setCamera(null)
    }

  }, [cameraProps, camera])

  const onEnd = useMemo(() => {
    return (e) => {
      if (!pageNode) return;
      pageNode.setPropValue('camera.position', e?.target?.object.position?.toArray?.());
      pageNode.document.selection.clear();
      if (target) {
        getNode(target.componentId).select();
      } else {
        pageNode.select();
      }
    };
  }, [getNode, pageNode, target])

  useEffect(() => {
    if (currentTransformControlTarget) {
      currentTransformControlTarget.detach();
      currentTransformControlTarget = null;
    }
  }, [target]);

  return <Canvas
    ref={canvasRef}
    className="threeDPage"
    camera={camera}
    shadows
    onPointerMissed={() => setTarget(null)}
  >
    <CustomScene background={background} backgroundType={backgroundType} texture={texture}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0, 'XYZ']}>
        <planeGeometry args={[100, 100]} />
        <meshPhongMaterial color={0x999999} depthWrite={false}/>
      </mesh>
      <gridHelper args={[100, 100, 0x888888, 0x888888]} />
      {_children}

      <OrbitControls
        makeDefault
        onEnd={onEnd}
      />
      {__designMode === 'design' && target ? (
        <TransformControls
          object={target}
          mode={modes[transformMode]}
          onMouseUp={(e) => {
            const node = getNode(e.target.object?.componentId);
            node.setPropValue('rotation', e.target.object.rotation.toArray());
            node.setPropValue('position', e.target.object.position.toArray());
            node.setPropValue('scale', e.target.object.scale.toArray());
            currentTransformControlTarget = e.target;
          } } />
      ) : null}
    </CustomScene>
  </Canvas>;
}

const Fallback = (props) => {

  const { children, ...otherProps } = props || {};

  return <Loading fullScreen>
    <Content {...otherProps} >
      {/* {
        children
      } */}
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

const AmbientLight = (props) => {
  return <ambientLight {...props} />
};

AmbientLight.isLight = true;
AmbientLight.AmbientLight = true;

const DirectionalLight = (props) => {
  const { position, scale, rotation, onClick, onContextMenu, onPointerOut, onPointerOver, componentId, __designMode, ...otherProps } = props;
  if (__designMode !== 'design') {
    return <directionalLight position={position} {...otherProps} />
  }
  return <mesh
    scale={scale}
    position={position}
    rotation={rotation}
    onClick={onClick}
    onContextMenu={onContextMenu}
    onPointerOut={onPointerOut}
    onPointerOver={onPointerOver}
    componentId={componentId}
  >
    <sphereGeometry />
    <meshStandardMaterial emissive={new Color('#f8e71c')}/>
    <directionalLight {...otherProps} />
  </mesh>
};

DirectionalLight.isLight = true;

export { Page, AmbientLight, DirectionalLight };
