
import { ComponentMetadata, Snippet } from '@alilc/lowcode-types';

const BoxMeta: ComponentMetadata = {
  group: '模型',
  category: '基础几何',
  "componentName": "Box",
  "title": "Box",
  "docUrl": "",
  "screenshot": "/public/box.png",
  "devMode": "proCode",
  "npm": {
    "package": "@alilc/3d-materials",
    "version": "0.1.0",
    "exportName": "Box",
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
    "title": "Box",
    "screenshot": "/public/box.png",
    "schema": {
      "componentName": "Box",
      "props": {}
    }
  }
];

export default {
  ...BoxMeta,
  snippets
};
