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
              logo: 'https://cdn.npmmirror.com/npmmirror-logo.png'
            }
          },
        },
      },
    ],
  ],
};
