/* eslint-disable no-debugger */
<!--
 * @Author: zulezhe
 * @Date: 2021-05-11 09:14:09
 * @LastEditors: zulezhe
 * @LastEditTime: 2021-05-12 15:19:38
 * @Path: https://gitee.com/zulezhe/
 * @Description: $
-->
<template>
  <div ref="display" />
</template>

<script>
import Vue from 'vue';
import { randomStr } from '../../utils';
export default {
  name: 'SPreview',
  props: {
    code: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      id: randomStr(),
      html: '',
      js: '',
      css: '',
      component: null,
    };
  },
  mounted() {
    console.log(this.$el);
    this.renderCode();
  },
  beforeDestroy() {
    this.destroyCode();
  },
  methods: {
    getSource(source, type) {
      const regex = new RegExp(`<${type}[^>]*>`);
      let openingTag = source.match(regex);

      if (!openingTag) return '';
      else openingTag = openingTag[0];

      return source.slice(source.indexOf(openingTag) + openingTag.length, source.lastIndexOf(`</${type}>`));
    },
    //分割代码
    splitCode() {
      this.js = this.getSource(this.code, 'script').replace(/export default/, 'return ');
      this.css = this.getSource(this.code, 'style');
      this.html = '<div id="app" style="width:100%;height:100%">' + this.getSource(this.code, 'template') + '</div>';
    },
    //挂载
    renderCode() {
      this.splitCode();
      if (this.html !== '' && this.js !== '') {
        const parseStrToFunc = new Function(this.js)();
        parseStrToFunc.template = this.html;
        const Component = Vue.extend(parseStrToFunc);
        this.component = new Component().$mount();
        this.$refs.display.appendChild(this.component.$el);
        if (this.css !== '') {
          const style = document.createElement('style');
          style.type = 'text/css';
          style.id = this.cssid;
          style.innerHTML = this.css;
          document.getElementsByTagName('head')[0].appendChild(style);
        }
      }
    },
    destroyCode() {
      const $target = document.getElementById(this.cssid);
      if ($target) $target.parentNode.removeChild($target);

      if (this.component) {
        this.$refs.display.removeChild(this.component.$el);
        this.component.$destroy();
        this.component = null;
      }
    },
  },
};
</script>
<style scoped lang="less"></style>
