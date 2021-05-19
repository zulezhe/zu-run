/* eslint-disable no-debugger */
<!--
 * @Author: zulezhe
 * @Date: 2021-05-11 09:14:09
 * @LastEditors: zulezhe
 * @LastEditTime: 2021-05-19 15:29:31
 * @Path: https://gitee.com/zulezhe/
 * @Description: $
-->
<template>
  <div ref="display" id="display" />
</template>

<script>
import Vue from 'vue';
import { randomStr } from '../../utils';
export default {
  name: 'ZuPreview',
  props: {
    code: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      id: randomStr(),
      cssid: randomStr(),
      html: '',
      js: '',
      css: '',
      component: null,
    };
  },
  mounted() {
    this.$watch('code', this.renderCode, { immediate: true });
    // this.renderCode();
  },
  beforeDestroy() {
    this.destroyCode();
  },
  methods: {
    //分割代码
    splitCode() {
      this.js = this.getSource(this.code, 'script').replace(/export default/, 'return ');
      this.css = this.getSource(this.code, 'style');
      this.html = '<div ref="ZuRunPreview" id="zu-run-preview" style="width:50%;height:100%" >' + this.getSource(this.code, 'template') + '</div>';
    },
    //挂载
    renderCode() {
      this.splitCode();
      if (this.html !== '' && this.js !== '') {
        const parseStrToFunc = new Function(this.js)();
        const vm = new Vue({
          template: this.html,
          ...parseStrToFunc,
        });
        if (this.css !== '') {
          const style = document.createElement('style');
          style.type = 'text/css';
          style.id = this.cssid;
          style.innerHTML = this.css;
          document.getElementsByTagName('head')[0].appendChild(style);
        }
        //在文档之外渲染并且随后挂载
        this.component = vm.$mount(this.$el);
      }
    },
    destroyCode() {
      const $target = document.getElementById(this.cssid);
      if ($target) $target.parentNode.removeChild($target);
      if (this.component) {
        this.component.$destroy();
        this.component = null;
      }
    },
    // 获取模板源码
    getSource(source, type) {
      const regex = new RegExp(`<${type}[^>]*>`);
      let openingTag = source.match(regex);
      if (!openingTag) return '';
      else openingTag = openingTag[0];
      return source.slice(source.indexOf(openingTag) + openingTag.length, source.lastIndexOf(`</${type}>`));
    },
  },
};
</script>
<style scoped lang="less"></style>
