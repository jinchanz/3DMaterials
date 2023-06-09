import _extends from '@babel/runtime/helpers/esm/extends';
import { useThree } from '@react-three/fiber';
import omit from 'lodash.omit';
import pick from 'lodash.pick';
import * as React from 'react';
import * as THREE from 'three';
import { TransformControls as TransformControls$1 } from 'three-stdlib';

const TransformControls = /*#__PURE__*/React.forwardRef(({
  children,
  onChange,
  onMouseDown,
  onMouseUp,
  onObjectChange,
  object,
  ...props
}, ref) => {
  const transformOnlyPropNames = ['enabled', 'axis', 'mode', 'translationSnap', 'rotationSnap', 'scaleSnap', 'space', 'size', 'showX', 'showY', 'showZ'];
  const {
    camera,
    ...rest
  } = props;
  const transformProps = pick(rest, transformOnlyPropNames);
  const objectProps = omit(rest, transformOnlyPropNames); // @ts-expect-error new in @react-three/fiber@7.0.5

  const defaultControls = useThree(state => state.controls);
  const gl = useThree(({
    gl
  }) => gl);
  const defaultCamera = useThree(({
    camera
  }) => camera);
  const invalidate = useThree(({
    invalidate
  }) => invalidate);
  const explCamera = camera || defaultCamera;
  const [controls] = React.useState(() => new TransformControls$1(explCamera, gl.domElement));
  const group = React.useRef();
  React.useLayoutEffect(() => {
    if (object) controls == null ? void 0 : controls.attach(object instanceof THREE.Object3D ? object : object.current);else controls == null ? void 0 : controls.attach(group.current);
  }, [object, children, controls]);
  React.useEffect(() => {
    if (defaultControls) {
      const callback = event => defaultControls.enabled = !event.value;

      controls.addEventListener('dragging-changed', callback);
      return () => controls.removeEventListener('dragging-changed', callback);
    }
  }, [controls, defaultControls]);
  React.useEffect(() => {
    const callback = e => {
      invalidate();
      if (onChange) onChange(e);
    };

    controls == null ? void 0 : controls.addEventListener == null ? void 0 : controls.addEventListener('change', callback);
    if (onMouseDown) controls == null ? void 0 : controls.addEventListener == null ? void 0 : controls.addEventListener('mouseDown', onMouseDown);
    if (onMouseUp) controls == null ? void 0 : controls.addEventListener == null ? void 0 : controls.addEventListener('mouseUp', onMouseUp);
    if (onObjectChange) controls == null ? void 0 : controls.addEventListener == null ? void 0 : controls.addEventListener('objectChange', onObjectChange);
    return () => {
      controls == null ? void 0 : controls.removeEventListener == null ? void 0 : controls.removeEventListener('change', callback);
      if (onMouseDown) controls == null ? void 0 : controls.removeEventListener == null ? void 0 : controls.removeEventListener('mouseDown', onMouseDown);
      if (onMouseUp) controls == null ? void 0 : controls.removeEventListener == null ? void 0 : controls.removeEventListener('mouseUp', onMouseUp);
      if (onObjectChange) controls == null ? void 0 : controls.removeEventListener == null ? void 0 : controls.removeEventListener('objectChange', onObjectChange);
    };
  }, [onChange, onMouseDown, onMouseUp, onObjectChange, controls, invalidate]);

  console.log('transfromcontrols rendering: ', defaultControls)

  return controls ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("primitive", _extends({
    ref: ref,
    dispose: undefined,
    object: controls
  }, transformProps)), /*#__PURE__*/React.createElement("group", _extends({
    ref: group
  }, objectProps), children)) : null;
});

export { TransformControls };
