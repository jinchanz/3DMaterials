
import { ComponentMetadata, Snippet } from '@alilc/lowcode-types';

const DamagedHelmetMeta: ComponentMetadata = {
  group: '模型',
  category: '模型',
  "componentName": "DamagedHelmet",
  "title": "DamagedHelmet",
  "docUrl": "",
  "screenshot": "/public/screenshots/damaged-helmet.png",
  "devMode": "proCode",
  "npm": {
    "package": "@alilc/3d-materials",
    "version": "0.1.0",
    "exportName": "DamagedHelmet",
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
    "title": "DamagedHelmet",
    "screenshot": "/public/screenshots/damaged-helmet.png",
    "schema": {
      "componentName": "DamagedHelmet",
      "props": {}
    }
  }
];

export default {
  ...DamagedHelmetMeta,
  // snippets
};
