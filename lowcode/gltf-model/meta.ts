
import { IPublicTypeComponentMetadata, IPublicTypeSnippet } from '@alilc/lowcode-types';

const FerrariMeta: IPublicTypeComponentMetadata = {
  group: '模型',
  category: '模型',
  "componentName": "GltfModel",
  "title": "GLTF模型",
  "docUrl": "",
  "screenshot": "/public/screenshots/ferrari.jpg",
  "devMode": "proCode",
  "npm": {
    "package": "@alilc/3d-materials",
    "version": "0.1.0",
    "exportName": "GltfModel",
    "main": "src/index.tsx",
    "destructuring": true,
    "subName": ""
  },
  "configure": {
    "props": [
      {
        name: 'castShadow',
        title: '透射阴影',
        setter: 'BoolSetter',
      },
      {
        name: 'receiveShadow',
        title: '接受阴影',
        setter: 'BoolSetter',
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
      {
        name: 'currentAnimation',
        title: '当前动画',
        setter: 'NumberSetter'
      },
      {
        name: 'enableAnimationInEditor',
        title: '播放动画',
        setter: 'BoolSetter'
      }
    ],
    "supports": {
      loop: false,
      condition: false
    },
    "component": {}
  }
};
const snippets: IPublicTypeSnippet[] = [
  {
    "title": "Ferrari",
    "screenshot": "/public/screenshots/ferrari.jpg",
    "schema": {
      title: 'Ferrari',
      "componentName": "GltfModel",
      "props": {
        modelUrl: '/public/models/glTF/ferrari.glb'
      }
    }
  },
  {
    "title": "DamagedHelmet",
    "screenshot": "/public/screenshots/damaged-helmet.png",
    "schema": {
      "title": "DamagedHelmet",
      "componentName": "GltfModel",
      "props": {
        modelUrl: '/public/models/glTF/DamagedHelmet.gltf',
        defaultTransform: [0, 1, 0]
      }
    }
  },
  {
    "title": "House",
    "screenshot": "/public/screenshots/damaged-helmet.png",
    "schema": {
      "title": "House",
      "componentName": "GltfModel",
      "props": {
        modelUrl: '/public/models/glTF/LittlestTokyo.glb',
        defaultScale: 0.05,
        defaultTransform: [0, 10, 0]
      }
    }
  },
  {
    "title": "Soldier",
    "screenshot": "/public/screenshots/damaged-helmet.png",
    "schema": {
      "title": "Soldier",
      "componentName": "GltfModel",
      "props": {
        modelUrl: '/public/models/glTF/Soldier.glb'
      }
    }
  }
];

export default {
  ...FerrariMeta,
  snippets
};
