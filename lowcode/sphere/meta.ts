
import { ComponentMetadata, Snippet } from '@alilc/lowcode-types';

const SphereMeta: ComponentMetadata = {
  group: '模型',
  category: '基础几何',
  "componentName": "Sphere",
  "title": "Sphere",
  "docUrl": "",
  "screenshot": "/public/sphere.jpg",
  "devMode": "proCode",
  "npm": {
    "package": "@alilc/3d-materials",
    "version": "0.1.0",
    "exportName": "Sphere",
    "main": "src/index.tsx",
    "destructuring": true,
    "subName": ""
  },
  "configure": {
    "props": [
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "color",
            "zh-CN": "color"
          }
        },
        "name": "color",
        "setter": "ColorSetter"
      }
    ],
    "supports": {
      "style": true
    },
    "component": {}
  }
};
const snippets: Snippet[] = [
  {
    "title": "Sphere",
    "screenshot": "/public/sphere.jpg",
    "schema": {
      "componentName": "Sphere",
      "props": {}
    }
  }
];

export default {
  ...SphereMeta,
  snippets
};
