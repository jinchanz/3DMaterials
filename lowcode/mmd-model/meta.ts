
import { IPublicTypeComponentMetadata, IPublicTypeSnippet } from '@alilc/lowcode-types';

const MmdModelMeta: IPublicTypeComponentMetadata = {
  group: '模型',
  category: '模型',
  "componentName": "MmdModel",
  "title": "GLTF模型",
  "docUrl": "",
  "screenshot": "/public/screenshots/ferrari.jpg",
  "devMode": "proCode",
  "npm": {
    "package": "@alilc/3d-materials",
    "version": "0.1.0",
    "exportName": "MmdModel",
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
    "title": "MmdModel",
    "screenshot": "/public/screenshots/damaged-helmet.png",
    "schema": {
      "title": "MmdModel",
      "componentName": "MmdModel",
      "props": {
        modelUrl: '/public/models/mmd/cube.mdd'
      }
    }
  }
];

export default {
  ...MmdModelMeta,
  snippets
};
