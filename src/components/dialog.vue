<template>
  <van-popup v-model="show" style="background-color: transparent">
    <div class="publish-pop center-center">
      <div class="publish-main">
        <div class="head-box">
          <div class="box-1">
            <div class="t-1">温馨提示</div>
          </div>
        </div>
        <div class="info-box center-center">
          <div class="box-1">
            <div class="t-1">{{ txt }}</div>
          </div>
        </div>
        <div class="btn-box">
          <!-- <div class="btn" @click="close">取消</div> -->
          <div class="btn on" @click="sure">确认 ({{ countdown }})</div>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script>
export default {
  name: "tipsDialog",
  data() {
    return {
      show: false,
      txt: "",
      countdown: 3, // 初始倒计时时间
      timer: null, // 存储定时器引用，用于后面清除定时器。
    };
  },
  props: {
    autoClose: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    close() {
      this.show = false;
    },
    sure() {
      this.show = false;
      this.$emit("sure");
    },
    open(v = "选择号码错误，请重新确认号码") {
      this.txt = v;
      this.show = true;
      this.countdown = 3;
      this.startCountdown();
    },
    startCountdown() {
      this.timer = setInterval(() => {
        // 使用setInterval来持续更新countdown。
        if (this.countdown > 0) {
          // 当countdown大于0时继续减少。
          this.countdown -= 1; // 每次减少1秒。
        } else {
          // 当countdown等于0时停止定时器。
          this.show = false;
          clearInterval(this.timer); // 清除定时器以避免不必要的调用。可以在这里重置countdown或进行其他操作。例如：this.countdown = 10; this.startCountdown(); 如果需要重新开始倒计时。
        }
      }, 1000);
    },
  },
};
</script>
<style lang="scss" scoped>
.publish-pop {
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
  }
  .publish-main {
    position: relative;
    width: 388px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #fff;
    .top {
      background: #be2834;
      font-size: 34px;
      font-weight: 500;
      text-align: center;
      padding: 16px;
      color: #fff;
    }
    .head-box {
      padding: 20px 26px;
      text-align: center;
      border-bottom: 1px solid #b3b1b4;
    }
    .info-box {
      padding: 0 16px;
      // height: 192px;
      .box-1 {
        padding: 24px 36px;
        text-align: left;
        .t-1 {
          font-size: 24px;
          // font-weight: 500;
        }
        .t-2 {
          color: #777777;
          margin-top: 8px;
        }
      }
      .box-2 {
        padding: 26px 0;
        .t-box {
          display: flex;
          margin-top: 12px;
          font-weight: 500;
          &:first-child {
            margin-top: 0;
          }
          .l-t {
            width: 300px;
            text-align: right;
          }
          .r-t {
            .on {
              color: #be2834;
              right: 4px;
            }
          }
        }
      }
    }
    .btn-box {
      display: flex;
      .btn {
        flex: 1;
        height: 78px;
        line-height: 78px;
        text-align: center;
        border: 1px solid #b3b1b4;
        &.on {
          background: #fff;
          color: #29a4ec;
        }
      }
    }
  }
}
</style>
