<!--
 * @Author: zulezhe
 * @Date: 2021-05-10 15:28:20
 * @LastEditors: zulezhe
 * @LastEditTime: 2021-05-13 10:28:35
 * @Path: https://gitee.com/zulezhe/
 * @Description: $
-->
<template>
  <div class="zu-run-container">
    <div class="demo-split">
      <zu-split v-model="split">
        <div slot="left" class="demo-split-pane">
          <zu-edit ref="mycodemirror" v-model="code" class="left-box" :options="cmOptions" @codeEditComplate="codeEditComplate" @handleRun="handleRun" @change="handleChange" @handleReset="handleReset" />
        </div>
        <div slot="right" class="demo-split-pane">
          <zu-preview v-if="runCodeHash" ref="runcode" class="right-box" :code="code" />
        </div>
      </zu-split>
    </div>
  </div>
</template>
<script>
import ZuSplit from '../Split/index.vue';
import ZuEdit from '../Edit/index.vue';
import ZuPreview from '../Preview/index.vue';
export default {
  name: 'ZuRun',
  components: { ZuSplit, ZuEdit, ZuPreview },
  props: ['code'],
  data() {
    return {
      initCode: this.code,
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
      // this.codeEdit.setValue(this.codeEdit.getValue());
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
