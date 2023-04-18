const { library } = require('./build.json');

module.exports = {
  alias: {
    '@': './src',
  },
  plugins: [
    [
      '@alifd/build-plugin-lowcode',
      {
        library,
        engineScope: "@alilc",
        staticResources: {
          enginePresetCssUrl: 'https://alifd.alicdn.com/npm/@alifd/lowcode-preset-plugin@1.1.9-beta.0/dist/editor-preset-plugin.css',
          enginePresetJsUrl: 'https://alifd.alicdn.com/npm/@alifd/lowcode-preset-plugin@1.1.9-beta.0/dist/editor-preset-plugin.js',
        },
        presetConfig: {
          pluginConfig: {
            logo: {
              logo: 'https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*pDJSTbz7wgAAAAAAAAAAAAAADvuFAQ/original'
            }
          },
          simulatorUrl: [
            'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@1.0.18/dist/js/react-simulator-renderer.js',
            'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@1.0.18/dist/css/react-simulator-renderer.css',
          ]
        },
        customPlugins: [
          
        ]
      },
    ],
  ],
};
