/* eslint-disable react/no-unknown-property */
import React, { Suspense, useState, createElement, useRef, useMemo, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useCursor, OrbitControls, useHelper, Html, PerspectiveCamera as PerspectiveCameraC, PointerLockControls } from '@react-three/drei';

import { PerspectiveCamera, Color, EquirectangularReflectionMapping, CameraHelper, Vector3 } from 'three';

import { RGBELoader } from 'three-stdlib';

import { create } from 'zustand'

import { TransformControls } from '../../utils/TransformControls';

import './index.scss';
import { Loading } from '@alifd/next';
import GltfModel from '../gltf-model';

let lastChildren;

// 记录当前被操控的对象，当切换选择对象时，调用 detach 方法释放操控
let currentTransformControlTarget;

const modes = ['translate', 'rotate', 'scale'];

const useStore = create((set, get) => ({
  PerspectiveCamera: null
}))



const velocity = new Vector3();
const direction = new Vector3();
let prevTime = performance.now();
let moveForward = false;
let moveLeft = false;
let moveBackward = false;
let moveRight = false;
let canJump = false;

const onKeyDown = function ( event ) {
  switch ( event.code ) {
    case 'ArrowUp':
    case 'KeyW':
      moveForward = true
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = true;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = true;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveRight = true;
      break;
    case 'Space':
      if ( canJump === true ) velocity.y += 200;
      canJump = false;
      break;
    default:
      break;
  }
};

const onKeyUp = function ( event ) {
  switch ( event.code ) {
    case 'ArrowUp':
    case 'KeyW':
      moveForward = false;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = false;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = false;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveRight = false;
      break;
    default:
      break;

  }
  console.log('on key up: ', event.code, moveForward, moveBackward)

};

document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );

function CustomScene(props) {
  const { children, background, backgroundType, texture, __designMode, ...otherProps } = props || {};
  const { gl, scene: sceneInst, setSize, camera } = useThree();
  const [environment, setEnvironment] = useState();

  const { PerspectiveCamera: playerCameraRef } = useStore((state) => ({ PerspectiveCamera: state.PerspectiveCamera }))

  useFrame(({ gl, camera, scene }) => {
    if (__designMode !== 'design') {
      gl.autoClear = false
      gl.clear()
      if (playerCameraRef?.current) {
        const width = window.innerHeight*playerCameraRef?.current.aspect || 100;
        gl.setViewport((window.innerWidth - width)/2, 0, window.innerHeight*playerCameraRef?.current.aspect, window.innerHeight)
        gl.render(scene, playerCameraRef.current)
      }
      return;
    }
    gl.autoClear = false
    gl.clear()
    const originalBg = scene.background;
    
    scene.background = originalBg
    gl.setViewport(0, 0, window.innerWidth, window.innerHeight)
    gl.render(scene, camera)
    if (playerCameraRef?.current) {
      gl.setViewport(0, 0, 90, 160)
      gl.render(scene, playerCameraRef.current)
    }
    gl.autoClear = true

  }, 1)

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

  const playerControlRef = useRef();
  const playerRef = useRef();

  useFrame(() => {
    if (!playerControlRef?.current) {
      // console.log('playerRef: ', playerRef.current)
      return;
    };
    const playerControl = playerControlRef.current;
    if (!playerControl.isLocked) {
      return;
    }
    const time = performance.now();
    const delta = ( time - prevTime ) / 1000;
    velocity.x -= velocity.x * 10 * delta;
    velocity.z -= velocity.z * 10 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
    
    direction.z = Number( !!moveForward ) - Number( !!moveBackward );
    direction.x = Number( !!moveRight ) - Number( !!moveLeft );
    direction.normalize(); // this ensures consistent movements in all directions

    if ( moveForward || moveBackward ) velocity.z -= direction.z * 400 * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * 400 * delta;

    playerControl.moveRight( - velocity.x * delta );
    playerControl.moveForward( - velocity.z * delta );

    playerControl.getObject().position.y += ( velocity.y * delta ); // new behavior

    if ( playerControl.getObject().position.y < 2 ) {

      velocity.y = 0;
      playerControl.getObject().position.y = 2;

      canJump = true;

    }
    // playerRef.current.position.copy(new Vector3(playerControl.getObject().position.x, 0, playerControl.getObject().position.z))
    prevTime = time;
  }, 1);

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
    { __designMode === 'design' ? null : playerCameraRef?.current && <PointerLockControls camera={playerCameraRef?.current} ref={playerControlRef} /> }
    
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

  const { PerspectiveCamera: playerCameraRef } = useStore((state) => ({ PerspectiveCamera: state.PerspectiveCamera }))

  return <Canvas
    ref={canvasRef}
    className="threeDPage"
    camera={camera}
    shadows
    onPointerMissed={() => setTarget(null)}
  >
    <CustomScene __designMode={__designMode} background={background} backgroundType={backgroundType} texture={texture}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0, 'XYZ']}>
        <planeGeometry args={[100, 100]} />
        <meshPhongMaterial color={0x999999} depthWrite={false}/>
      </mesh>
      <gridHelper args={[100, 100, 0x888888, 0x888888]} />
      {_children}

      { __designMode === 'design' ? <OrbitControls
        makeDefault
        onEnd={onEnd}
      /> : null}
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

const PerspectiveCameraComp = (props) => {

  const { label, aspect, position, scale, rotation, onClick, onContextMenu, onPointerOut, onPointerOver, componentId, __designMode, ...otherProps } = props;

  const ref = React.useRef()
  useEffect(() => {
    if (ref?.current) {
      useStore.setState({
        PerspectiveCamera: ref
      })
    }
    ref.current.aspect = __designMode !== 'design' ? window.innerWidth/window.innerHeight : aspect || 1;
    ref.current.updateProjectionMatrix();
  }, [label, otherProps.aspect])
  useHelper(ref, __designMode !== 'design' ? null : CameraHelper)

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
    { 
      __designMode === 'design' ?
      <>
        <Html className="label">{'相机'}</Html> 
        <sphereGeometry />
        <meshStandardMaterial emissive={new Color('red')}/>
      </> : null
    }
    <Suspense fallback={null}>
      <GltfModel
        currentAnimation={3} 
        modelUrl='/public/models/glTF/Soldier.glb' 
      />
    </Suspense>
    <PerspectiveCameraC {...otherProps} aspect={__designMode !== 'design' ? window.innerWidth/window.innerHeight : aspect || 1} manual frustumCulled ref={ref} />
  </mesh>
}

PerspectiveCameraComp.isPerspectiveCamera = true;

export { Page, AmbientLight, DirectionalLight, PerspectiveCameraComp };
