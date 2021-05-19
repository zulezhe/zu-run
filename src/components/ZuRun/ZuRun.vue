<!--
 * @Author: zulezhe
 * @Date: 2021-05-10 15:28:20
 * @LastEditors: zulezhe
 * @LastEditTime: 2021-05-19 14:28:40
 * @Path: https://gitee.com/zulezhe/
 * @Description: $
-->
<template>
  <div class="zu-run-container"></div>
</template>
<script>
export default {
  name: 'ZuRun',
  props: {
    code: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      initCode: this.code,
    };
  },
  mounted() {
    console.log(this.code);
  },
  methods: {},
};
</script>
<style scoped lang="less">
.zu-run-container {
  width: 100%;
  height: 100%;
  background-color: #f3f4fa;
  .demo-split {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .demo-split-pane {
    height: 100%;
    overflow: auto;
    .left-box,
    .right-box {
      width: 100%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
    }
  }
}
</style>
