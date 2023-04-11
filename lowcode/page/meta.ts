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
      },
      {
        name: 'editorCamera',
        title: '默认相机',
        setter: {
          componentName: 'ObjectSetter',
          props: {
            config: {
              items: [
                {
                  name: "position",
                  title: "坐标",
                  setter: {
                    componentName: 'ObjectSetter',
                    props: {
                      config: {
                        items: [
                          {
                            name: '0',
                            title: 'x',
                            setter: 'NumberSetter',
                            important: true
                          },
                          {
                            name: '1',
                            title: 'y',
                            setter: 'NumberSetter',
                            important: true
                          },
                          {
                            name: '2',
                            title: 'z',
                            setter: 'NumberSetter',
                            important: true
                          },
                        ],
                      },
                    }
                  }
                },
              ]
            }
          },
          initialValue: () => {
            return {
              
            };
          }
        }
      }
    ],
    supports: {
      style: false,
    },
    component: {
      isMinimalRenderUnit: true,
    },
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
            1000,
          );
          const cameraPosition = currentNode.getPropValue('editorCamera.position');
          if (cameraPosition) {
            camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
          } else {
            camera.position.set(0, 12, 30);
          }
          camera.lookAt(0, 0, 0);
          camera.updateMatrixWorld(true);
          const clipCoord = new Vector3(x1, y1, 0.99);
          const targetCoord = clipCoord.unproject(camera);

          if (node?.componentName?.endsWith('Light')) {
            node.setPropValue('position', targetCoord.toArray());
            return;
          }

          const vec = targetCoord.clone().sub(camera.position.clone());

          const t = -targetCoord.y/vec.y;

          const result = new Vector3(targetCoord.x + t*vec.x, 0, targetCoord.z + t*vec.z);

          node.setPropValue('position', result.toArray());
        },
      },
      initialChildren: [
        {
          componentName: 'AmbientLight'
        },
        {
          componentName: 'DirectionalLight'
        }
      ]
    },
  },
};

const AmbientLight: IPublicTypeComponentMetadata = {
  group: '光源',
  componentName: 'AmbientLight',
  title: 'AmbientLight',
  docUrl: '',
  devMode: 'proCode',
  npm: {
    package: '@alilc/3d-materials',
    version: '0.1.0',
    exportName: 'AmbientLight',
    main: 'src/index.tsx',
    destructuring: true,
    subName: '',
  },
  configure: {
    props: [
      {
        name: "position",
        title: "坐标",
        setter: {
          componentName: 'ObjectSetter',
          props: {
            config: {
              items: [
                {
                  name: '0',
                  title: 'x',
                  setter: 'NumberSetter',
                  important: true
                },
                {
                  name: '1',
                  title: 'y',
                  setter: 'NumberSetter',
                  important: true
                },
                {
                  name: '2',
                  title: 'z',
                  setter: 'NumberSetter',
                  important: true
                },
              ],
            },
          }
        }
      },
      {
        name: "intensity",
        title: "光强",
        setter: {
          componentName: 'NumberSetter',
          props: {
            precision: 2,
            step: 0.01,
          },
          initialValue: 1.00
        },
        defaultValue: 1.00
      },
    ],
    supports: {
      style: false,
    },
  },
  snippets: [
    {
      title: 'AmbientLight',
      schema: {
        componentName: 'AmbientLight',
        props: {
          defaultValue: 1.00
        }
      }
    }
  ]
};
const DirectionalLight: IPublicTypeComponentMetadata = {
  group: '光源',
  componentName: 'DirectionalLight',
  title: '平行光',
  docUrl: '',
  "screenshot": "/public/directionalLight.svg",
  devMode: 'proCode',
  npm: {
    package: '@alilc/3d-materials',
    version: '0.1.0',
    exportName: 'DirectionalLight',
    main: 'src/index.tsx',
    destructuring: true,
    subName: '',
  },
  configure: {
    props: [
      {
        name: "position",
        title: "坐标",
        setter: {
          componentName: 'ObjectSetter',
          props: {
            config: {
              items: [
                {
                  name: '0',
                  title: 'x',
                  setter: 'NumberSetter',
                  important: true
                },
                {
                  name: '1',
                  title: 'y',
                  setter: 'NumberSetter',
                  important: true
                },
                {
                  name: '2',
                  title: 'z',
                  setter: 'NumberSetter',
                  important: true
                },
              ],
            },
          }
        }
      },
      {
        name: 'castShadow',
        title: '产生阴影',
        setter: 'BoolSetter',
        defaultValue: false,
      },
      {
        name: "intensity",
        title: "光强",
        setter: {
          componentName: 'NumberSetter',
          props: {
            precision: 2,
            step: 0.01,
          },
        },
        defaultValue: 1.00
      },
    ],
    supports: {
      style: false,
    },
  },
  snippets: [
    {
      title: '平行光',
      "screenshot": "/public/directionalLight.svg",
      schema: {
        componentName: 'DirectionalLight',
        props: {
          defaultValue: 1.00,
          castShadow: false,
          'shadow-mapSize-width': 1024,
          'shadow-mapSize-height': 1024,
          'shadow-camera-far': 50,
          'shadow-camera-left': -100,
          'shadow-camera-right': 100,
          'shadow-camera-top': 100,
          'shadow-camera-bottom': -100,
        }
      }
    }
  ]
};

export default [
  Page,
  DirectionalLight,
  AmbientLight
];
