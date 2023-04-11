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
        name: 'backgroundConfig',
        title: '背景',
        type: 'group',
        display: 'block',
        items: [
          {
            name: 'backgroundType',
            title: '类型',
            setter: {
              componentName: 'RadioGroupSetter',
              props: {
                options: [
                  {
                    label: '颜色',
                    value: 'color'
                  },
                  {
                    label: '贴图',
                    value: 'texture'
                  }
                ]
              }
            }
          },
          {
            name: 'background',
            setter: 'ColorSetter',
            condition: (target) => target.getProps().getPropValue('backgroundType') === 'color'
          },
          {
            name: 'texture',
            setter: {
              componentName: 'SelectSetter',
              props: {
                options: [
                  {
                    label: 'memorial',
                    value: 'memorial.hdr'
                  },
                  {
                    label: 'venice_sunset_1k',
                    value: 'venice_sunset_1k.hdr'
                  }
                ]
              }
            },
            condition: (target) => target.getProps().getPropValue('backgroundType') === 'texture'
          }
        ]
      },
      {
        name: 'camera',
        title: '编辑器相机',
        setter: {
          componentName: 'ObjectSetter',
          props: {
            config: {
              items: [
                {
                  name: 'position',
                  title: '坐标',
                  setter: {
                    componentName: 'ObjectSetter',
                    props: {
                      config: {
                        items: [
                          {
                            name: '0',
                            title: 'X',
                            setter: 'NumberSetter'
                          },
                          {
                            name: '1',
                            title: 'Y',
                            setter: 'NumberSetter'
                          },
                          {
                            name: '2',
                            title: 'Z',
                            setter: 'NumberSetter'
                          }
                        ]
                      }
                    }
                  }
                },
              ]
            },
          },
        }
      }
    ],
    supports: {
      style: false,
      condition: false,
      loop: false
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
            200,
          );
          const cameraPosition = currentNode.getPropValue('camera.position');
          if (cameraPosition) {
            camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
          } else {
            camera.position.set(0, 12, 30);
          }
          camera.lookAt(0, 0, 0);
          camera.updateMatrixWorld(true);
          const clipCoord = new Vector3(x1, y1, 0.99);
          const targetCoord = clipCoord.unproject(camera);

          if (node?.componentName.endsWith('Light')) {
            node.setPropValue('position', targetCoord.toArray());
            return;
          }


          const vec = targetCoord.clone().sub(camera.position.clone());

          const t = -targetCoord.y/vec.y;

          const result = new Vector3(targetCoord.x + t*vec.x, 0, targetCoord.z + t*vec.z);

          node.setPropValue('position', result.toArray());
        },
      },
    },
  },
};

const AmbientLight: IPublicTypeComponentMetadata = {
  group: '光源',
  componentName: 'AmbientLight',
  title: 'AmbientLight',
  docUrl: '',
  screenshot: '/public/screenshots/ambient.png',
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
        name: 'intensity',
        setter: {
          componentName: 'NumberSetter',
          props: {
            step: 0.01
          }
        },
        defaultValue: 0.2
      },
    ],
    supports: {
      style: false,
      condition: false,
      loop: false
      
    },
    advanced: {},
  },
  snippets: [
    {
      title: 'AmbientLight',
      screenshot: '/public/screenshots/ambient.png',
      schema: {
        componentName: 'AmbientLight',
        props: {
          intensity: 0.2
        }
      }
    }
  ]
};

const DirectionalLight: IPublicTypeComponentMetadata = {
  group: '光源',
  componentName: 'DirectionalLight',
  title: 'DirectionalLight',
  docUrl: '',
  screenshot: '/public/screenshots/directional.png',
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
        name: 'intensity',
        setter: {
          componentName: 'NumberSetter',
          props: {
            step: 0.01
          }
        },
        defaultValue: 1
      },
      {
        name: 'castShadow',
        setter: 'BoolSetter'
      },
      {
        name: 'position',
        title: '坐标',
        setter: {
          componentName: 'ObjectSetter',
          props: {
            config: {
              items: [
                {
                  name: '0',
                  title: 'X',
                  setter: 'NumberSetter'
                },
                {
                  name: '1',
                  title: 'Y',
                  setter: 'NumberSetter'
                },
                {
                  name: '2',
                  title: 'Z',
                  setter: 'NumberSetter'
                }
              ]
            }
          }
        }
      },
    ],
    supports: {
      style: false,
      condition: false,
      loop: false
    },
  },
  snippets: [
    {
      title: '平行光',
      screenshot: '/public/screenshots/directional.png',
      schema: {
        title: '平行光',
        componentName: 'DirectionalLight',
        props: {
          intensity: 1
        }
      }
    }
  ]
};

export default [
  Page,
  AmbientLight,
  DirectionalLight
];
