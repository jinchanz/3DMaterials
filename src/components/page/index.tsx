/* eslint-disable react/no-unknown-property */
import React, { Suspense, useState, createElement, useRef, useMemo, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useCursor, OrbitControls, useHelper, Html, PerspectiveCamera as PerspectiveCameraC, PointerLockControls, PointerLockControlsProps } from '@react-three/drei';

import { PerspectiveCamera, Color, EquirectangularReflectionMapping, CameraHelper, Vector3, Object3D } from 'three';

import { RGBELoader } from 'three-stdlib';

import { create } from 'zustand'

import { TransformControls } from '../../utils/TransformControls'

import './index.scss';
import { Loading } from '@alifd/next';
import GltfModel from '../gltf-model';

let lastChildren;

const modes = ['translate', 'rotate', 'scale'];

const useStore = create((set, get) => ({
  playerCameraRef: null,
  selectedTarget: null,
}))

let currentSelectedTarget;
const modelMap = {};

const velocity = new Vector3();
const direction = new Vector3();
const playerVector = new Vector3();
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
      if ( canJump === true ) velocity.y += 50;
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

};

document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );

function CustomScene(props) {
  const { children, background, backgroundType, texture, __designMode, ...otherProps } = props || {};
  const { gl, scene: sceneInst, setSize, camera } = useThree();
  const [environment, setEnvironment] = useState();

  const { playerCameraRef, playerRef } = useStore((state) => ({ playerCameraRef: state.playerCameraRef, playerRef: state.playerRef }))

  useFrame(({ gl, camera, scene }) => {
    if (__designMode !== 'design') {
      gl.autoClear = false
      gl.clear()
      if (playerCameraRef?.current) {
        const width = window.innerHeight*playerCameraRef?.current.aspect || 100;
        gl.setViewport((window.innerWidth - width)/2, 0, window.innerHeight*playerCameraRef?.current.aspect, window.innerHeight)
        gl.render(sceneInst, playerCameraRef.current)
      }
      return;
    }
    gl.autoClear = false
    gl.clear()

    gl.setViewport(0, 0, window.innerWidth, window.innerHeight)
    gl.render(sceneInst, camera)
    if (playerCameraRef?.current) {
      gl.setViewport(0, 0, 90, 160)
      gl.render(sceneInst, playerCameraRef.current)
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

  if (!window.onresize) {
    window.onresize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);
      setSize(window.innerWidth, window.innerHeight)
      gl.render(sceneInst, camera)
    };
  }

  const playerControlRef = useRef<PointerLockControlsProps>();

  useFrame(() => {
    if (!playerControlRef?.current || !playerRef?.current) {
      return;
    };
    const playerControl = playerControlRef.current;
    const playerModel: Object3D = playerRef.current;
    if (!playerControl.isLocked) {
      return;
    }
    const time = performance.now();
    const delta = ( time - prevTime ) / 1000;
    velocity.x -= velocity.x * 60 * delta;
    velocity.z -= velocity.z * 60 * delta;

    velocity.y -= 9.8 * 10.0 * delta; // 100.0 = mass
    
    direction.z = Number( !!moveForward ) - Number( !!moveBackward );
    direction.x = Number( !!moveRight ) - Number( !!moveLeft );
    direction.normalize(); // this ensures consistent movements in all directions

    if ( moveForward || moveBackward ) velocity.z -= direction.z * 400 * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * 400 * delta;

    playerControl.moveRight( - velocity.x * delta );
    playerControl.moveForward( - velocity.z * delta );

    playerControl.getObject().position.y += ( velocity.y * delta ); // new behavior

    playerVector.setFromMatrixColumn(playerCameraRef.current.matrix, 0);
    playerModel.position.addScaledVector(playerVector, - velocity.x * delta);

    playerVector.setFromMatrixColumn(playerCameraRef.current.matrix, 0);
    playerVector.crossVectors(playerCameraRef.current.up, playerVector);
    playerModel.position.addScaledVector(playerVector, - velocity.z * delta);
    playerModel.position.y += ( velocity.y * delta );

    if ( playerControl.getObject().position.y < 2 || playerModel.position.y < 0) {

      velocity.y = 0;
      playerControl.getObject().position.y = 2;
      playerModel.position.y = 0;

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

  const [hovered, setHovered] = useState(false);
  const [transformMode, setTransformMode] = useState(0);
  const { selectedTarget: target } = useStore((state) => ({ selectedTarget: state.selectedTarget }))
  if (pageNode && !target) {
    pageNode.select();
  }

  useCursor(hovered);
  const _children = [];
  
  React.Children.map(children, (child) => {
    if (child.type !== 'div') {
      const overrideProps = {
        
      };
      if (__designMode === 'design') {
        Object.assign(overrideProps, {
          onClick: (event) => {
            event.nativeEvent.preventDefault()
            let _target = event.object;
            while (_target.parent && !_target.componentId) {
              _target = _target.parent;
            }
            if (!_target.parent || !_target.componentId) return;
            if (currentSelectedTarget && (currentSelectedTarget?.componentId === _target.componentId)) return;
            setTimeout(() => {
              const node = getNode(_target?.componentId);
              node.select();
            })
            console.log('on click: ', Object.assign({}, _target), Object.assign({}, currentSelectedTarget || {msg: 'undefine'}))
            currentSelectedTarget = _target;
            useStore.setState({
              selectedTarget: _target
            })
            
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

  const transformControlsRef = useRef<typeof TransformControls>();
  const orbitControlsRef = useRef<typeof OrbitControls>();

  React.useEffect(() => {
    console.log('in camera change ')
    camera.position.fromArray(cameraProps?.position || [0, 8, 30]);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld(true);
    setCamera(camera);

    return () => {
      setCamera(null)
    }
  }, [])

  useEffect(() => {
    if (props?.removedItem === target?.componentId) clearSelection();
  }, [props?.removedItem])

  const clearSelection = () => {
    useStore.setState({selectedTarget: null})
    if (transformControlsRef?.current) {
      transformControlsRef?.current.detach();
    }
    currentSelectedTarget = null;
  }

  useEffect(() => {
    if (transformControlsRef?.current) {
      transformControlsRef?.current.detach();
    }
  }, [target]);

  console.log('rendering: ', Object.assign({}, target))

  return <Canvas
    ref={canvasRef}
    className="threeDPage"
    camera={camera}
    shadows
    onPointerMissed={clearSelection}
  >
    <CustomScene __designMode={__designMode} background={background} backgroundType={backgroundType} texture={texture}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0, 'XYZ']}>
        <planeGeometry args={[100, 100]} />
        <meshPhongMaterial color={0x999999} depthWrite={false}/>
      </mesh>
      <gridHelper args={[100, 100, 0x888888, 0x888888]} />
      {_children}

      { __designMode === 'design' ? 
        <OrbitControls makeDefault ref={orbitControlsRef} /> : null
      }
      {__designMode === 'design' && target && target.parent ? (
        <TransformControls
          ref={transformControlsRef}
          object={target}
          mode={modes[transformMode]}
          onMouseUp={(e) => {
            const node = getNode(target?.componentId);
            setTimeout(() => {
              node.setPropValue('rotation', target.rotation.toArray());
              node.setPropValue('position', target.position.toArray());
              node.setPropValue('scale', target.scale.toArray());
              console.log('cameraPosition: ', cameraProps.position, orbitControlsRef.current.object.position)
              clearSelection()
            })
          } } 
        />
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

const ThirdPersonCamera = (props) => {

  const { label, aspect, position, scale, rotation, onClick, onContextMenu, onPointerOut, onPointerOver, componentId, __designMode, ...otherProps } = props;

  const ref = React.useRef<PerspectiveCamera>()
  const playerRef = React.useRef()
  useEffect(() => {
    if (ref?.current) {
      useStore.setState({
        playerCameraRef: ref,
        playerRef
      })
    }
    ref.current.aspect = __designMode !== 'design' ? window.innerWidth/window.innerHeight : aspect || 1;
    ref.current.updateProjectionMatrix();
  }, [label, otherProps.aspect])
  useHelper(ref, __designMode !== 'design' ? null : CameraHelper)
  return <group
    scale={scale}
    rotation={rotation}
    position={position}
    componentId={componentId}
    onClick={onClick}
    onContextMenu={onContextMenu}
    onPointerOut={onPointerOut}
    onPointerOver={onPointerOver}
  >
    <PerspectiveCameraC 
      {...otherProps} 
      position={new Vector3(0,  2, 5)}
      aspect={__designMode !== 'design' ? window.innerWidth/window.innerHeight : aspect || 1} 
      manual frustumCulled 
      ref={ref} >
      { 
        __designMode === 'design' ?
        <>
          <Html className="label">{'相机'}</Html> 
          <sphereGeometry />
          <meshStandardMaterial emissive={new Color('red')}/>
        </> : null
      }
    </PerspectiveCameraC>
    <Suspense fallback={null}>
      <GltfModel
        ref={playerRef}
        __designMode={__designMode}
        currentAnimation={3} 
        modelUrl='/public/models/glTF/Soldier.glb' 
      />
    </Suspense>
  </group>
}

ThirdPersonCamera.isPerspectiveCamera = true;

const FirstPersonCamera = (props) => {

  const { label, aspect, position, scale, rotation, onClick, onContextMenu, onPointerOut, onPointerOver, componentId, __designMode, ...otherProps } = props;

  const ref = React.useRef<PerspectiveCamera>()
  const playerRef = React.useRef()
  useEffect(() => {
    if (ref?.current) {
      useStore.setState({
        playerCameraRef: ref,
        playerRef
      })
    }
    ref.current.aspect = __designMode !== 'design' ? window.innerWidth/window.innerHeight : aspect || 1;
    ref.current.updateProjectionMatrix();
  }, [label, otherProps.aspect])
  useHelper(ref, __designMode !== 'design' ? null : CameraHelper)
  return <group
    ref={playerRef}
    position={position}
    rotation={rotation}
    componentId={componentId}
    onClick={onClick}
    onContextMenu={onContextMenu}
    onPointerOut={onPointerOut}
    onPointerOver={onPointerOver}
  >
    <PerspectiveCameraC 
      {...otherProps}
      position={new Vector3(0, 1.2, 0)}
      aspect={__designMode !== 'design' ? window.innerWidth/window.innerHeight : aspect || 1} 
      manual frustumCulled 
      ref={ref} >
        <Suspense fallback={null}>
          <GltfModel
            __designMode={__designMode}
            position={new Vector3(0, -1.2, -0.7)}
            currentAnimation={3} 
            enableAnimationInEditor={false}
            modelUrl='/public/models/glTF/Soldier.glb' 
          />
        </Suspense>
    </PerspectiveCameraC>
  </group>
}

FirstPersonCamera.isPerspectiveCamera = true;

export { Page, AmbientLight, DirectionalLight, ThirdPersonCamera, FirstPersonCamera };
