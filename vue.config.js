const path = require('path');

module.exports = {
  lintOnSave: false,

  outputDir: './docs',
  publicPath: './',
  runtimeCompiler: true,
  configureWebpack: {
    entry: {
      app: path.resolve(__dirname, './example/main.js'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './example'),
      },
    },
  },
  chainWebpack: (config) => {
    config.module.rule('js').include.add(path.resolve(__dirname, './example'));
  },
  css: {
    loaderOptions: {},
  },
};
