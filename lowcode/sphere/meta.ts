
import { IPublicTypeComponentMetadata, IPublicTypeSnippet } from '@alilc/lowcode-types';

const SphereMeta: IPublicTypeComponentMetadata = {
  group: '模型',
  category: '基础几何',
  "componentName": "Sphere",
  "title": "Sphere",
  "docUrl": "",
  "screenshot": "/public/screenshots/sphere.png",
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
        name: 'object',
        title: '对象',
        type: 'group',
        display: 'block',
        items: [
          {
            name: 'object.castShadow',
            setter: 'BoolSetter',
          },
          {
            name: 'object.position',
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
      {
        name: 'material',
        title: '材质',
        type: 'group',
        display: 'block',
        items: [
          {
            "title": {
              "label": {
                "type": "i18n",
                "en-US": "color",
                "zh-CN": "颜色"
              }
            },
            "name": "material.color",
            "setter": "ColorSetter"
          },{
            "title": {
              "label": {
                "type": "i18n",
                "en-US": "roughness",
                "zh-CN": "粗糙度"
              }
            },
            "name": "material.roughness",
            "setter": {
              componentName: 'NumberSetter',
              props: {
                min: 0,
                max: 1,
                step: 0.01
              }
            }
          },{
            "title": {
              "label": {
                "type": "i18n",
                "en-US": "color",
                "zh-CN": "金属度"
              }
            },
            "name": "material.metalness",
            "setter": {
              componentName: 'NumberSetter',
              props: {
                min: 0,
                max: 1,
                step: 0.01
              }
            }
          },{
            "title": {
              "label": {
                "type": "i18n",
                "en-US": "emissive",
                "zh-CN": "自发光"
              }
            },
            "name": "material.emissive",
            "setter": "ColorSetter"
          },{
            "title": {
              "label": {
                "type": "i18n",
                "en-US": "emissiveIntensity",
                "zh-CN": "自发光强度"
              }
            },
            "name": "material.emissiveIntensity",
            setter: {
              componentName: 'NumberSetter',
              props: {
                step: 0.01
              }
            },
          },
        ]
      }
    ],
    "supports": {
      "style": true
    },
    "component": {}
  }
};
const snippets: IPublicTypeSnippet[] = [
  {
    "title": "Sphere",
    "screenshot": "/public/screenshots/sphere.png",
    "schema": {
      "componentName": "Sphere",
      "props": {
        defaultTransform: [0, 1, 0]
      }
    }
  }
];

export default {
  ...SphereMeta,
  snippets
};
