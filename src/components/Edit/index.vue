<!--
 * @Author: zulezhe
 * @Date: 2021-05-11 09:09:56
 * @LastEditors: zulezhe
 * @LastEditTime: 2021-05-19 16:36:10
 * @Path: https://gitee.com/zulezhe/
 * @Description: $
-->
<template>
  <div class="custom-codemirror-container">
    <div class="zu-run-edit-header">
      <span @click="handleCopy">
        复制
      </span>
      <span @click="handleRun">
        运行
      </span>
      <span @click="handleReset">
        复位
      </span>
    </div>
    <vue-tabs>
      <v-tab title="代码">
        <textarea ref="textarea" class="editor" />
      </v-tab>
      <v-tab title="描述">
        <div class="desc"></div>
      </v-tab>
    </vue-tabs>
  </div>
</template>
<script>
import CodeMirror from 'codemirror';
import { VueTabs, VTab } from 'vue-nav-tabs';
//you can also import this in your style tag
import 'vue-nav-tabs/themes/vue-tabs.css';
import './index.js';
//  插件
import emmet from '@emmetio/codemirror-plugin';
emmet(CodeMirror);
import './custom.less';
import Copy from '../../utils/clipboard.js';
export default {
  name: 'ZuEdit',
  components: { VueTabs, VTab },
  props: {
    cmOptions: {
      type: Object,
      default: () => {},
    },
    value: {
      type: String,
      default: '<template> <h1>hello</h1></h1></template>',
    },
  },
  data() {
    return {
      codeEdit: null,
      coder: null,
      options: {
        mode: 'vue',
        theme: 'lucario',
        lineNumbers: true,
        // 缩进
        tabSize: 2,
        //自动缩进
        smartIndent: false,
        // 缩进单位
        indentUnit: 2,
        //自动聚焦
        autofocus: true,
        // 行号
        line: true,
        styleActiveLine: true,
        //括号匹配
        matchBrackets: true,
        //滚动条
        scrollbarStyle: null,
        //折叠
        foldGutter: true,
        lineWrapping: true,
        hintOptions: {
          // 当匹配只有一项的时候是否自动补全
          completeSingle: false,
        },
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
        extraKeys: {
          Tab: 'emmetExpandAbbreviation',
          Enter: 'emmetInsertLineBreak',
          Ctrl: 'autocomplete',
        },
      },
    };
  },
  watch: {
    value(val) {
      val !== this.codeEdit.getValue() && this.codeEdit.setValue(val);
    },
  },
  mounted() {
    this.codeEdit = CodeMirror.fromTextArea(this.$refs.textarea, Object.assign(this.options, this.cmOptions));
    // 加载完成
    this.$emit('codeEditComplate', this.codeEdit);
    this.codeEdit.on('change', this.handleChange);
  },
  methods: {
    handleChange() {
      /* istanbul ignore next */
      this.$emit('change', this.codeEdit.getValue());
    },
    handleCopy() {
      let isSuccess = Copy(this.codeEdit.getValue());
      if (isSuccess) {
        alert('复制成功');
      } else {
        alert('复制失败,请重试');
      }
    },
    handleRun() {
      this.$emit('handleRun');
    },
    handleReset() {
      this.$emit('handleReset');
    },
  },
};
</script>
<style scoped lang="less">
.custom-codemirror-container {
  width: 100%;
  height: 100%;
  .zu-run-edit-header {
    height: 40px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      padding: 5px 30px;
      border: 1px solid #999;
      background-color: rgb(0, 122, 204);
      color: #fff;
      border-radius: 5px;
      margin-left: 10px;
      cursor: pointer;
    }
    span:active {
      transform: scale(1.1);
    }
  }
}
</style>
