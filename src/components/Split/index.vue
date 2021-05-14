<!--
 * @Author: zulezhe
 * @Date: 2021-05-10 15:22:19
 * @LastEditors: zulezhe
 * @LastEditTime: 2021-05-13 10:31:41
 * @Path: https://gitee.com/zulezhe/
 * @Description: $
-->
<template>
  <div ref="outerWrapper" :class="wrapperClasses">
    <div v-if="isHorizontal" :class="`${prefix}-horizontal`">
      <div :style="{ right: `${anotherOffset}%` }" class="left-pane" :class="paneClasses">
        <slot name="left" />
      </div>
      <div :class="`${prefix}-trigger-con`" :style="{ left: `${offset}%` }" @mousedown="handleMousedown">
        <slot name="trigger">
          <trigger mode="vertical" />
        </slot>
      </div>
      <div :style="{ left: `${offset}%` }" class="right-pane" :class="paneClasses">
        <slot name="right" />
      </div>
    </div>
    <div v-else :class="`${prefix}-vertical`">
      <div :style="{ bottom: `${anotherOffset}%` }" class="top-pane" :class="paneClasses">
        <slot name="top" />
      </div>
      <div :class="`${prefix}-trigger-con`" :style="{ top: `${offset}%` }" @mousedown="handleMousedown">
        <slot name="trigger">
          <trigger mode="horizontal" />
        </slot>
      </div>
      <div :style="{ top: `${offset}%` }" class="bottom-pane" :class="paneClasses">
        <slot name="bottom" />
      </div>
    </div>
  </div>
</template>

<script>
import { oneOf, on, off } from '../../utils';
import Trigger from './trigger.vue';
export default {
  name: 'ZuSplit',
  components: {
    Trigger,
  },
  props: {
    value: {
      type: [Number, String],
      default: 0.5,
    },
    mode: {
      validator(value) {
        return oneOf(value, ['horizontal', 'vertical']);
      },
      default: 'horizontal',
    },
    min: {
      type: [Number, String],
      default: '40px',
    },
    max: {
      type: [Number, String],
      default: '40px',
    },
  },
  data() {
    return {
      prefix: 'zu-run-split',
      offset: 0,
      oldOffset: 0,
      isMoving: false,
      computedMin: 0,
      computedMax: 0,
      currentValue: 0.5,
    };
  },
  computed: {
    wrapperClasses() {
      return [`${this.prefix}-wrapper`, this.isMoving ? 'no-select' : ''];
    },
    paneClasses() {
      return [
        `${this.prefix}-pane`,
        {
          [`${this.prefix}-pane-moving`]: this.isMoving,
        },
      ];
    },
    isHorizontal() {
      return this.mode === 'horizontal';
    },
    anotherOffset() {
      return 100 - this.offset;
    },
    valueIsPx() {
      return typeof this.value === 'string';
    },
    offsetSize() {
      return this.isHorizontal ? 'offsetWidth' : 'offsetHeight';
    },
  },
  watch: {
    value(val) {
      if (val !== this.currentValue) {
        this.currentValue = val;
        this.computeOffset();
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.computeOffset();
    });
    on(window, 'resize', this.computeOffset);
  },
  beforeDestroy() {
    off(window, 'resize', this.computeOffset);
  },
  methods: {
    px2percent(numerator, denominator) {
      return parseFloat(numerator) / parseFloat(denominator);
    },
    getComputedThresholdValue(type) {
      let size = this.$refs.outerWrapper[this.offsetSize];
      if (this.valueIsPx) return typeof this[type] === 'string' ? this[type] : size * this[type];
      else return typeof this[type] === 'string' ? this.px2percent(this[type], size) : this[type];
    },
    getMin(value1, value2) {
      if (this.valueIsPx) return `${Math.min(parseFloat(value1), parseFloat(value2))}px`;
      else return Math.min(value1, value2);
    },
    getMax(value1, value2) {
      if (this.valueIsPx) return `${Math.max(parseFloat(value1), parseFloat(value2))}px`;
      else return Math.max(value1, value2);
    },
    getAnotherOffset(value) {
      let res = 0;
      if (this.valueIsPx) res = `${this.$refs.outerWrapper[this.offsetSize] - parseFloat(value)}px`;
      else res = 1 - value;
      return res;
    },
    handleMove(e) {
      let pageOffset = this.isHorizontal ? e.pageX : e.pageY;
      let offset = pageOffset - this.initOffset;
      let outerWidth = this.$refs.outerWrapper[this.offsetSize];
      let value = this.valueIsPx ? `${parseFloat(this.oldOffset) + offset}px` : this.px2percent(outerWidth * this.oldOffset + offset, outerWidth);
      let anotherValue = this.getAnotherOffset(value);
      if (parseFloat(value) <= parseFloat(this.computedMin)) value = this.getMax(value, this.computedMin);
      if (parseFloat(anotherValue) <= parseFloat(this.computedMax)) value = this.getAnotherOffset(this.getMax(anotherValue, this.computedMax));
      e.atMin = this.value === this.computedMin;
      e.atMax = this.valueIsPx ? this.getAnotherOffset(this.value) === this.computedMax : this.getAnotherOffset(this.value).toFixed(5) === this.computedMax.toFixed(5);
      this.$emit('input', value);
      this.$emit('on-moving', e);
    },
    handleUp() {
      this.isMoving = false;
      off(document, 'mousemove', this.handleMove);
      off(document, 'mouseup', this.handleUp);
      this.$emit('on-move-end');
    },
    handleMousedown(e) {
      console.log('鼠标按下', e);
      this.initOffset = this.isHorizontal ? e.pageX : e.pageY;
      this.oldOffset = this.value;
      this.isMoving = true;
      on(document, 'mousemove', this.handleMove);
      on(document, 'mouseup', this.handleUp);
      this.$emit('on-move-start');
    },
    computeOffset() {
      this.$nextTick(() => {
        this.computedMin = this.getComputedThresholdValue('min');
        this.computedMax = this.getComputedThresholdValue('max');
        // https://github.com/view-design/ViewUI/commit/d827b6405c365b9b7c130448f509724564cad8c1
        // todo 这里对 px 没有适配，先还原
        this.offset = ((this.valueIsPx ? this.px2percent(this.value, this.$refs.outerWrapper[this.offsetSize]) : this.value) * 10000) / 100;
      });
    },
  },
};
</script>

<style lang="less">
// split样式
.zu-run-split-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
.zu-run-split-pane {
  position: absolute;
}
.zu-run-split-pane.left-pane,
.zu-run-split-pane.right-pane {
  top: 0;
  bottom: 0;
}
.zu-run-split-pane.left-pane {
  left: 0;
}
.zu-run-split-pane.right-pane {
  right: 0;
}
.zu-run-split-pane.bottom-pane,
.zu-run-split-pane.top-pane {
  left: 0;
  right: 0;
}
.zu-run-split-pane.top-pane {
  top: 0;
}
.zu-run-split-pane.bottom-pane {
  bottom: 0;
}
.zu-run-split-pane-moving {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.zu-run-split-trigger {
  border: 1px solid #dcdee2;
}
.zu-run-split-trigger-con {
  position: absolute;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  z-index: 10;
}
.zu-run-split-trigger-bar-con {
  position: absolute;
  overflow: hidden;
}
.zu-run-split-trigger-bar-con.vertical {
  left: 1px;
  top: 50%;
  height: 32px;
  -webkit-transform: translate(0, -50%);
  -ms-transform: translate(0, -50%);
  transform: translate(0, -50%);
}
.zu-run-split-trigger-bar-con.horizontal {
  left: 50%;
  top: 1px;
  width: 32px;
  -webkit-transform: translate(-50%, 0);
  -ms-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
}
.zu-run-split-trigger-vertical {
  width: 6px;
  height: 100%;
  background: #f8f8f9;
  border-top: none;
  border-bottom: none;
  cursor: col-resize;
}
.zu-run-split-trigger-vertical .zu-run-split-trigger-bar {
  width: 4px;
  height: 1px;
  background: rgba(23, 35, 61, 0.25);
  float: left;
  margin-top: 3px;
}
.zu-run-split-trigger-horizontal {
  height: 6px;
  width: 100%;
  background: #f8f8f9;
  border-left: none;
  border-right: none;
  cursor: row-resize;
}
.zu-run-split-trigger-horizontal .zu-run-split-trigger-bar {
  height: 4px;
  width: 1px;
  background: rgba(23, 35, 61, 0.25);
  float: left;
  margin-right: 3px;
}
.zu-run-split-horizontal > .zu-run-split-trigger-con {
  top: 50%;
  height: 100%;
  width: 0;
}
.zu-run-split-vertical > .zu-run-split-trigger-con {
  left: 50%;
  height: 0;
  width: 100%;
}
.zu-run-split .no-select {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
