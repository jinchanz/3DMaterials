import init, { editor, project, material, setters, config } from '@alifd/lowcode-preset-plugin';
import mergeWith from 'lodash/mergeWith';
import AssetsExplorePlugin from '../lowcode/plugins/assets-explore/index';


const queryObject = new URLSearchParams(window.location.search);
const fullbackMeta = 'default' || '';
let platform = queryObject.get('platform') || '';
let metaType = queryObject.get('metaType') || platform || '';
const metaPathMap = {"meta":"/Users/mark.ck/Workspace/opensource/lowcode/3d-materials/.tmp/meta.js"};
const key = metaType ? `meta.${metaType}` : 'meta';
if (!metaPathMap[key]) {
  console.warn(`[@alifd/build-plugin-lowcode] metaType can only in [${Object.keys(metaPathMap)}], current metaType is ${key}, fullback to ${fullbackMeta || 'default'}.`);
  metaType = fullbackMeta === 'default' ? '' : fullbackMeta;
}
const isNewEngineVersion = !!material;
const devMode = !!true;
const baseLibrary = 'react';
const basePackages = [
  {
    package: 'moment',
    version: '2.24.0',
    urls: ['https://g.alicdn.com/mylib/moment/2.24.0/min/moment.min.js'],
    library: 'moment',
  },
  {
    package: "lodash",
    library: "_",
    urls: [
      "https://g.alicdn.com/platform/c/lodash/4.6.1/lodash.min.js"
    ]
  },
  {
    title: 'fusion组件库',
    package: '@alifd/next',
    version: '1.25.23',
    urls: [
      'https://g.alicdn.com/code/lib/alifd__next/1.25.23/next.min.css',
      'https://g.alicdn.com/code/lib/alifd__next/1.25.23/next-with-locales.min.js',
    ],
    library: 'Next',
  },
  {
    package: 'antd',
    version: '4.17.3',
    urls: [
      'https://g.alicdn.com/code/lib/antd/4.17.3/antd.min.js',
      'https://g.alicdn.com/code/lib/antd/4.17.3/antd.min.css',
    ],
    library: 'antd',
  },
];

if (baseLibrary === 'rax') {
  basePackages.push({
    title: 'meet',
    package: '@alifd/meet',
    version: 'meet@2.4.2-beta.6',
    urls: [
      'https://mc-fusion.alibaba-inc.com/unpkg/@alifd/meet@2.4.2-beta.6/umd/meet.lowcode.js',
      'https://mc-fusion.alibaba-inc.com/unpkg/@alifd/meet@2.4.2-beta.6/umd/meet.min.css',
    ],
    library: 'Meet',
  });
}

const assets = {
  packages: []
};

let assetsName = './assets-dev.json';

const setterMap = {
};
const presetConfig = {"pluginConfig":{"logo":{"logo":"https://cdn.npmmirror.com/npmmirror-logo.png"}}};
const customPlugins = [
  AssetsExplorePlugin
];

const type = 'component';

if (devMode && type !== 'setter') {
  assets.packages.push({
    "package": "@alilc/3d-materials",
    "version": "0.1.0",
    "library": "BizComps",
    "urls": ["/view.js"],
    "editUrls": ["/view.js"],
    "advancedUrls": {"default":["./default.view.js"]},
  });
  assets.groupList = ["精选组件","原子组件"];
  assets.sort = {
    "groupList": ["精选组件","原子组件"],
    "categoryList": ["基础元素","布局容器类","表格类","表单详情类","帮助类","对话框类","业务类","通用","引导","信息输入","信息展示","信息反馈"]
  };
  assets.ignoreComponents = {};

  assets.components = [{
    exportName: 'Alilc3dMaterialsMeta',
    url: metaType ? `/meta.${metaType}.js` : '/meta.js',
  }];
}

const schema = getPageSchema() || {
  componentName: 'Page',
  id: 'node_dockcviv8fo1',
  props: {
    ref: 'outterView',
    style: {
      height: '100%',
    },
  },
  fileName: 'lowcode',
  dataSource: {
    list: [],
  },
  state: {
    text: 'outter',
    isShowDialog: false,
  },
  css: 'body {font-size: 12px;} .botton{width:100px;color:#ff00ff}',
  lifeCycles: {
    componentDidMount: {
      type: 'JSFunction',
      value: "function() {\n    console.log('did mount');\n  }",
    },
    componentWillUnmount: {
      type: 'JSFunction',
      value: "function() {\n    console.log('will umount');\n  }",
    },
  },
  methods: {
    testFunc: {
      type: 'JSFunction',
      value: "function() {\n    console.log('test func');\n  }",
    },
    onClick: {
      type: 'JSFunction',
      value: 'function() {\n    this.setState({\n      isShowDialog: true\n    })\n  }',
    },
    closeDialog: {
      type: 'JSFunction',
      value: 'function() {\n    this.setState({\n      isShowDialog: false\n    })\n  }',
    },
  },
  children: [],
};

const LCE_CONTAINER = document.getElementById('lce-container');

init(() => {
  return {
    name: 'editor-init',
    async init() {
      if (typeof setterMap === 'object' && Object.keys(setterMap).length) {
        setters.registerSetter(setterMap);
      }
      if (!devMode) {
        const devAssets = await (await fetch(assetsName)).json();
        const packages = devAssets.packages;
        assets.packages = assets.packages.concat(packages);
        assets.components = devAssets.components.map(item => {
          if (item.advancedUrls && metaType && item.advancedUrls[metaType] && item.advancedUrls[metaType].length) {
            item.url = item.advancedUrls[metaType][0];
          } else if (item.urls && metaType && item.urls[metaType]) {
            item.url = item.urls[metaType];
          }
          return item;
        });
        assets.groupList = devAssets.groupList;
      } else {
        const extraAssets = [];
        const builtinAssets = [];
        extraAssets && await handleExtraAssets(assets, extraAssets);
        builtinAssets && await handleExtraAssets(assets, builtinAssets);
      }

       // Overwrite the same library in basePackages
      const packagesMap = new Map();
      const sortedKeys = [...new Set(
        [...basePackages, ...assets.packages].map((item) => {
          const { library } = item;
          packagesMap.set(library, item);
          return library;
        })
      )];
      assets.packages = sortedKeys.map((key) => packagesMap.get(key));

      assets.packages = assets.packages.map(item => {
        if (item.editUrls && item.editUrls.length) {
          item.renderUrls = item.urls;
          item.urls = item.editUrls;
        }
        return item;
      })

      if (baseLibrary && baseLibrary === 'rax') {
        if (isNewEngineVersion) {
          config.set('renderEnv', 'rax');
          config.set('simulatorUrl', undefined);
        } else {
          editor.set('renderEnv', 'rax');
          project.onRendererReady(() => {
            editor.get('designer').currentDocument.simulator._iframe.onload = () => {
              editor.get('designer').currentDocument.simulator.set('device', 'phone');
            }
          });
        }
      }

      if (isNewEngineVersion) {
        material.setAssets(assets);
        project.openDocument(schema);
      } else {
        editor.setAssets(assets);
        project.open(schema);
      }
    },
  }
}, customPlugins || [], LCE_CONTAINER, {
  ...presetConfig
});

function getPageSchema() {
  const schema = JSON.parse(
    window.localStorage.getItem('projectSchema') || '{}'
  );

  const pageSchema = schema?.componentsTree?.[0];
  return pageSchema;
};

async function handleExtraAssets(assets, extraAssets) {
  if (extraAssets && Array.isArray(extraAssets) && extraAssets.length) {
    const baseSchemas = await Promise.all(
      extraAssets.map(async (url) => {
        if (typeof url === 'object') {
          return url;
        } else {
          try {
            return (await fetch(url)).json();
          } catch (e) {
            console.error(`get assets data from builtin assets ${url} failed: `, e);
            return {};
          }
        }
      })
    );
    baseSchemas.forEach((item) => {
      const _assets = {
        ...item,
        packages: item.packages || [item.package],
        components: item.components,
        componentList: (item.componentList || []).map((comp) => {
          if (comp.children) {
            comp.children = comp.children.map((snippet) => {
              if (!snippet.sort) {
                snippet.sort = {
                  category: comp.title,
                  group: '原子组件',
                };
              }
              return snippet;
            });
          }
          return comp;
        }),
      };
      mergeWith(assets, _assets, (objValue, srcValue) => {
        if (Array.isArray(objValue) && Array.isArray(srcValue)) {
          return srcValue.concat(objValue);
        }
      });
    });
  }
}