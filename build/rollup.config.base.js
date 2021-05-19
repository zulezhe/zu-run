import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import vue from 'rollup-plugin-vue';
import cjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
const config = require('../package.json');

const { name, version } = config;
const file = (type) => `lib/${name}.${type}.js`;

export { name, file };
//
export default {
  input: 'src/index.js',
  external: ['vue'], // 告诉rollup，不打包vue;将其视为外部依赖
  plugins: [
    nodeResolve(),
    postcss({
      extensions: ['.pcss', '.less', '.css'],
      plugins: [nested(), cssnext({ warnForDuplicates: false }), cssnano()],
      extract: false, // 无论是 dev 还是其他环境这个配置项都不做 样式的抽离
    }),
    resolve({
      browser: true,
      mainFields: ['module', 'jsnext:main', 'main', 'browser'],
      extensions: ['.vue'],
    }),

    vue({
      // css: false 将<style>块转换为导入语句，rollup-plugin-css-only可以提取.vue文件中的样式
      css: false,
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue'],
    }),
    cjs(),
    replace({
      VERSION: JSON.stringify(version),
    }),
  ],
  watch: {
    include: 'src/**',
  },
};
