<template>
  <van-popup v-model="show" style="background-color: transparent">
    <div class="publish-pop center-center">
      <div class="publish-main">
        <div class="info-box center-center">
          <div class="box-1">
            <div class="t-1">{{ txt }}</div>
            <div class="t-2"></div>
          </div>
        </div>
        <div class="btn-box">
          <div class="btn" @click="close">取消</div>
          <div class="btn on" @click="sure">确认</div>
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
    width: 678px;
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
    .info-box {
      padding: 0 26px;
      height: 192px;
      .box-1 {
        padding: 24px 0;
        text-align: center;
        .t-1 {
          font-size: 32px;
          font-weight: 500;
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
        height: 88px;
        line-height: 88px;
        text-align: center;
        border: 1px solid #be2834;
        &.on {
          background: #be2834;
          color: #fff;
        }
      }
    }
  }
}
</style>
