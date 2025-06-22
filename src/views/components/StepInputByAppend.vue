<template>
  <div class="stepper">
    <!-- 只有在未隐藏减号时，才渲染 `-` 按钮 -->
    <button
      v-if="!hideMinus"
      class="center-center minBtn btnLeft"
      :class="{ disabled: disabled, isWelfare: isWelfare }"
      @click="decrease"
      :disabled="disabled"
    >
      -
    </button>

    <div
      class="align-center centerCon"
      :class="[computedCenterConClass, centerConClass]"
      :style="[computedCenterConStyle, centerConStyle]"
    >
      <input
        v-model="localValue"
        @input="handleInput"
        type="text"
        :disabled="disabled"
        class="stepper-input"
        :class="{ inputCenter: hideType }"
      />
      <span class="unit" v-if="!hideType">{{ unitLabel }}</span>
    </div>

    <!-- 只有在未隐藏加号时，才渲染 `+` 按钮 -->
    <button
      v-if="!hidePlus"
      class="center-center plusBtn btnRight"
      :class="{ disabled: disabled, isWelfare: isWelfare }"
      @click="increase"
      :disabled="disabled"
    >
      +
    </button>
  </div>
</template>

<script>
export default {
  props: {
    value: Number,
    min: {
      type: Number,
      default: 1,
    },
    max: {
      type: Number,
      default: 999,
    },
    type: {
      type: String,
      default: "multiplier", // 可选 "currency"
      validator: (val) => ["multiplier", "currency"].includes(val),
    },
    hideType: {
      type: Boolean,
      default: false,
    },
    hideMinus: {
      type: Boolean,
      default: false,
    },
    hidePlus: {
      type: Boolean,
      default: false,
    },
    isWelfare: {
      type: Boolean,
      default: false,
    },
    centerConClass: {
      type: String,
      default: "",
    },
    centerConStyle: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false, // 是否禁用整个组件
    },
    currIdex: {
      type: Number,
    },
    currItemData: {
      type: Object,
    },
  },
  data() {
    return {
      localValue: this.value,
    };
  },
  computed: {
    unitLabel() {
      let res = "";
      if (this.type === "currency") {
        res = "元";
      } else if (this.type === "multiplier") {
        res = "倍";
      }
      return res;
    },
    computedCenterConClass() {
      return {
        "border-left": this.hideMinus, // 隐藏 `-` 时显示左边框
        "border-right": this.hidePlus, // 隐藏 `+` 时显示右边框
        "rounded-left": this.hideMinus, // 隐藏 `-` 时左上、左下圆角
        "rounded-right": this.hidePlus, // 隐藏 `+` 时右上、右下圆角
        disabled: this.disabled, // 禁用时加灰色
      };
    },
    computedCenterConStyle() {
      let styles = {};
      if (this.hideMinus) {
        styles.borderLeft = "1px solid #d1d2d2";
        styles.borderTopLeftRadius = "12px";
        styles.borderBottomLeftRadius = "12px";
      }
      if (this.hidePlus) {
        styles.borderRight = "1px solid #d1d2d2";
        styles.borderTopRightRadius = "12px";
        styles.borderBottomRightRadius = "12px";
      }
      // if (this.disabled) {
      //   styles.backgroundColor = "#e0e0e0";
      //   styles.color = "#b0b0b0";
      // }
      return styles;
    },
  },
  watch: {
    value(newVal) {
      console.log("newVal", newVal);
      this.localValue = newVal;
    },
  },
  methods: {
    increase() {
      if (!this.disabled && this.localValue < this.max) {
        this.localValue++;
        // this.$emit("fatherMultiple", this.localValue);
        this.formatJsonItem(this.localValue);
      }
    },
    decrease() {
      if (!this.disabled && this.localValue > this.min) {
        this.localValue--;
        this.formatJsonItem(this.localValue);
      }
    },
    handleInput(event) {
      if (this.disabled) return;
      let val = event.target.value.replace(/\D/g, ""); // 只允许输入数字
      if (val === "") {
        this.localValue = ""; // 允许清空
      } else {
        val = Math.max(this.min, Math.min(this.max, Number(val)));
        this.localValue = val;
        // this.$emit("fatherMultiple", val);
        this.formatJsonItem(this.localValue);
      }
    },
    formatJsonItem(val) {
      let currJson = { ...this.currItemData };
      currJson.multiplier = val;

      this.$emit("fatherMultiple", currJson, this.currIdex);
    },
  },
};
</script>

<style scoped lang="less">
.stepper {
  display: flex;
  align-items: center;
  background: #f9f9fb;
  height: 54px;
  border-radius: 12px;
  border: 2px solid #d1d2d2;
}

button {
  box-sizing: border-box;
  width: 54px;
  height: 54px;
  border: 1px solid #d1d2d2;
  background: #f5f5f5;
  cursor: pointer;
  font-family: PingFang SC, PingFang SC;
  font-weight: 1000;
  font-size: 28px;
  line-height: 28px;
  color: #242424;
  text-align: left;
  transition: background 0.2s;
}

.minBtn {
  line-height: 1;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.plusBtn {
  line-height: 1;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

/* 禁用按钮 */
button.disabled {
  background: #e0e0e0;
  color: #b0b0b0;
  cursor: not-allowed;
}

/* 购彩篮按钮 */
button.isWelfare {
  border: 2px solid #d1d2d2;
  background: #f9f9fb;
  color: #242424;
}

.btnRight {
  border-right-width: 0 !important;
}

.btnLeft {
  border-left-width: 0 !important;
}

.inputCenter {
  width: 100% !important;
  text-align: center !important;
  color: #000000;
}

.centerCon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #d1d2d2;
  border-bottom: 1px solid #d1d2d2;
  width: 122px;
  height: 54px;
}

/* 隐藏 `-` 按钮时，左侧加边框和圆角 */
.border-left {
  border-left: 1px solid #d1d2d2 !important;
}

.rounded-left {
  border-top-left-radius: 12px !important;
  border-bottom-left-radius: 12px !important;
}

/* 隐藏 `+` 按钮时，右侧加边框和圆角 */
.border-right {
  border-right: 1px solid #d1d2d2 !important;
}

.rounded-right {
  border-top-right-radius: 12px !important;
  border-bottom-right-radius: 12px !important;
}

/* 禁用 input */
input.stepper-input {
  border: none;
  font-family: PingFang HK, PingFang HK;
  font-weight: 400;
  color: #000000;
  text-align: right;
  outline: none;
  background: #f9f9fb;
  flex: 1;
  min-width: 1px;
  width: auto;
  padding: 0;
  margin: 0;
}

input.stepper-input:disabled {
  // background: #e0e0e0;
  // color: #b0b0b0;
  cursor: not-allowed;
}

.unit {
  font-family: PingFang HK, PingFang HK;
  font-weight: 400;
  font-size: 24px;
  color: #000000;
  background: #f9f9fb;
  text-align: center;
  white-space: nowrap;
  margin-left: 2px;
  padding-right: 30px;
}
</style>
