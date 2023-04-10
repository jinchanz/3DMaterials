import { IPublicTypeComponentMetadata } from '@alilc/lowcode-types';

import { PerspectiveCamera, Vector3 } from 'three';

const Page: IPublicTypeComponentMetadata = {
  componentName: 'Page',
  title: 'Page',
  docUrl: '',
  screenshot: '',
  devMode: 'proCode',
  npm: {
    package: '@alilc/3d-materials',
    version: '0.1.0',
    exportName: 'Page',
    main: 'src/index.tsx',
    destructuring: true,
    subName: '',
  },
  configure: {
    props: [
      {
        name: 'background',
        title: '背景',
        setter: 'ColorSetter'
      }
    ],
    supports: {
      style: true,
    },
    component: {},
    advanced: {
      callbacks: {
        onNodeAdd: (node, currentNode) => {
          const { dropLocation } = node?.document || {};
          const { canvasX, canvasY } = dropLocation.event;
          const { width, height } = dropLocation.detail.edge;

          const x1 = (canvasX - width / 2) / (width / 2);
          const y1 = 1 - (canvasY / height) * 2;

          const camera = new PerspectiveCamera(
            25,
            window.innerWidth / window.innerHeight,
            0.1,
            100,
          );
          const cameraPosition = currentNode.getPropValue('cameraPosition');
          if (cameraPosition) {
            camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
          } else {
            camera.position.set(0, 12, 30);
          }
          camera.lookAt(0, 0, 0);
          camera.updateMatrixWorld(true);
          const clipCoord = new Vector3(x1, y1, 0.99);
          const targetCoord = clipCoord.unproject(camera);

          const vec = targetCoord.clone().sub(camera.position.clone());

          const t = -targetCoord.y/vec.y;

          const result = new Vector3(targetCoord.x + t*vec.x, 0, targetCoord.z + t*vec.z);

          node.setPropValue('position', result.toArray());
        },
      },
    },
  },
};

export default {
  ...Page,
};
