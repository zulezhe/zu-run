<!--
 * @Author: zulezhe
 * @Date: 2021-05-10 15:28:20
 * @LastEditors: zulezhe
 * @LastEditTime: 2021-05-19 14:41:43
 * @Path: https://gitee.com/zulezhe/
 * @Description: $
-->
<template>
  <div class="Zu-run-container">
    <div class="demo-split">
      <zu-run :code="code"></zu-run>
    </div>
  </div>
</template>
<script>
import ZuRun from '../../src/components/ZuRun/ZuRun';
import code from './template';
export default {
  name: 'ZuRun',
  components: { ZuRun },
  data() {
    return {
      code: code,
    };
  },
  methods: {},
};
</script>
<style scoped lang="less">
.Zu-run-container {
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
