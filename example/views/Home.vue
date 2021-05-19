<!--
 * @Author: zulezhe
 * @Date: 2021-05-10 15:28:20
 * @LastEditors: zulezhe
 * @LastEditTime: 2021-05-19 15:34:48
 * @Path: https://gitee.com/zulezhe/
 * @Description: $
-->
<template>
  <div class="Zu-run-container">
    <div class="demo-split">
      <zu-split v-model="split">
        <div slot="left" class="demo-split-pane">
          <zu-edit ref="mycodemirror" v-model="initCode" class="left-box" :options="cmOptions" @codeEditComplate="codeEditComplate" @handleRun="handleRun" @change="handleChange" @handleReset="handleReset" />
        </div>
        <div slot="right" class="demo-split-pane">
          <zu-preview v-if="runCodeHash" ref="runcode" class="right-box" :code="code" />
        </div>
      </zu-split>
    </div>
  </div>
</template>
<script>
// import { ZuEdit, ZuPreview, ZuSplit } from '../../src/index';
import { ZuEdit, ZuPreview, ZuSplit } from '../../lib/zu-run.umd';
import code from './template';
export default {
  name: 'ZuRun',
  components: { ZuEdit, ZuPreview, ZuSplit },
  data() {
    return {
      initCode: code,
      code: code,
      split: 0.5,
      runCodeHash: true,
      cmOptions: {},
      codeEdit: null,
    };
  },
  methods: {
    codeEditComplate(codeEdit) {
      console.log('编辑器初始化完成');
      this.codeEdit = codeEdit;
      setTimeout(() => {
        this.codeEdit.setValue(this.initCode);
      }, 0);
      codeEdit.on('keypress', () => {
        codeEdit.showHint();
      });
    },
    // 点击搜索
    searchCode() {
      this.codemirror.execCommand('find'); //触发
    },
    handleChange(val) {
      this.code = val;
      // this.$refs.runcode.destroyCode();
      // this.$refs.runcode.renderCode();
    },
    // 点击运行
    handleRun() {
      this.runCodeHash = false;
      this.$nextTick(() => {
        this.runCodeHash = true;
      });
      this.$refs.runcode.destroyCode();
      this.$refs.runcode.renderCode();
    },
    handleReset() {
      this.codeEdit.setValue(this.initCode);
    },
  },
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
