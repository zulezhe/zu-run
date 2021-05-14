import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import vue from 'rollup-plugin-vue';
import cjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import css from 'rollup-plugin-css-only'; // 提取css
import CleanCSS from 'clean-css'; // 压缩css
import fs from 'fs'; // 读写文件
import less from 'rollup-plugin-less';
const config = require('../package.json');

const { name, version } = config;
const file = (type) => `lib/${name}.${type}.js`;

export { name, file };
//
export default {
  input: 'src/index.js',
  external: ['vue'], // 告诉rollup，不打包vue;将其视为外部依赖
  plugins: [
    resolve({
      mainFields: ['module', 'jsnext:main', 'main', 'browser'],
      extensions: ['.vue'],
    }),
    vue({
      // css: false 将<style>块转换为导入语句，rollup-plugin-css-only可以提取.vue文件中的样式
      css: false,
    }),
    css({
      output(style) {
        !fs.existsSync('lib') && fs.mkdirSync('lib');
        fs.writeFileSync(`lib/${name}.css`, new CleanCSS().minify(style).styles);
      },
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue'],
    }),
    cjs(),
    less(),
    replace({
      VERSION: JSON.stringify(version),
    }),
  ],
  watch: {
    include: 'src/**',
  },
};
