
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
        modelUrl: '/public/models/glTF/DamagedHelmet.gltf'
      }
    }
  }
];

export default {
  ...FerrariMeta,
  snippets
};
