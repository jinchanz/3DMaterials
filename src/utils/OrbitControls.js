import _extends from '@babel/runtime/helpers/esm/extends';
import { useThree, useFrame } from '@react-three/fiber';
import * as React from 'react';
import { OrbitControls as OrbitControls$1 } from 'three-stdlib';

const OrbitControls = React.forwardRef(({
  makeDefault,
  camera,
  regress,
  domElement,
  enableDamping = true,
  onChange,
  onStart,
  onEnd,
  ...restProps
}, ref) => {
  const invalidate = useThree(({
    invalidate
  }) => invalidate);
  const defaultCamera = useThree(({
    camera
  }) => camera);
  const gl = useThree(({
    gl
  }) => gl);
  const set = useThree(({
    set
  }) => set);
  const get = useThree(({
    get
  }) => get);
  const performance = useThree(({
    performance
  }) => performance);
  const explCamera = camera || defaultCamera;
  const explDomElement = domElement || gl.domElement;
  const controls = React.useMemo(() => new OrbitControls$1(explCamera), [explCamera]);
  useFrame(() => {
    if (controls.enabled) controls.update();
  });
  React.useEffect(() => {
    const callback = e => {
      invalidate();
      if (regress) performance.regress();
      if (onChange) onChange(e);
    };

    controls.connect(explDomElement);
    controls.addEventListener('change', callback);
    if (onStart) controls.addEventListener('start', onStart);
    if (onEnd) controls.addEventListener('end', onEnd);
    console.log('in useEffect setup')
    return () => {
      console.log('in useEffect cleanUp')
      // controls.removeEventListener('change', callback);
      // if (onStart) controls.removeEventListener('start', onStart);
      // if (onEnd) controls.removeEventListener('end', onEnd);
      // controls.dispose();
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, onStart, onEnd, regress, controls, invalidate]);
  React.useEffect(() => {
    if (makeDefault) {
      // @ts-expect-error new in @react-three/fiber@7.0.5
      const old = get().controls; // @ts-expect-error new in @react-three/fiber@7.0.5

      set({
        controls
      }); // @ts-expect-error new in @react-three/fiber@7.0.5

      return () => set({
        controls: old
      });
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [makeDefault, controls]);
  return React.createElement("primitive", _extends({
    ref: ref,
    object: controls,
    enableDamping: enableDamping
  }, restProps));
});

export { OrbitControls };
