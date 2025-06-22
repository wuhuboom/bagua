<template>
  <van-popup v-model="show" position="bottom">
    <div class="c-page">
      <AppTopBar
        :back="close"
        :topBarTitle="detail.lotteryNameH5"
        class="app-top-bar"
      >
        <template v-slot:right>
          <div class="right-box" @click="openGroupBuy">发起合买</div>
        </template>
      </AppTopBar>
      <div class="time-box" v-if="detail.nextExpect?.countdown !== undefined">
        距{{ detail.nextExpect.nextExpect }}期截止:
        <van-count-down
          class="time"
          :time="milliseconds"
          format="HH小时mm分ss秒"
        />
      </div>
      <div class="cz-box">
        <div class="left" @click="close">+ 自选号码</div>
        <div class="right center-center" @click="delALL">
          <div class="del-icon"></div>
          <div>清空列表</div>
        </div>
      </div>
      <div v-for="(v, i) in tableList" :key="i" class="item-box">
        <!-- <div class="lists one">
          <div class="item">第一位</div>
          <div class="item">第二位</div>
          <div class="item">第三位</div>
        </div> -->
        <div class="lists two">
          <div class="item no-grow m-r-8">
            {{ v.text }}
          </div>
        </div>
        <div class="lists three">
          <div class="left">
            {{ v.model }} {{ v.total }}注
            {{ divide(v.total * multiple * $betPrice, false) }}元
          </div>
          <div class="right" @click="delOne(i)">删除</div>
        </div>
      </div>

      <div class="bottom-box">
        <div class="height"></div>
        <div class="bottom">
          <div class="left">
            <div class="zhui-btn center-center" @click="openChase">追期</div>
            <div class="num-box">
              <div>{{ totalALL }}注</div>
              <div class="input-box">
                <input
                  type="text"
                  class="input"
                  @blur="handels"
                  v-model.trim="multiple"
                />
              </div>
              <div>倍</div>
            </div>
            <div class="price">{{ totalMoney }}元</div>
          </div>
          <div class="right center-center" @click="sure">确定</div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import userApi from "@/api/user";
export default {
  name: "BetOn",
  data() {
    return {
      show: false,
      multiple: 1,
    };
  },
  computed: {
    totalALL() {
      return this.tableList.reduce((pre, cur) => pre + cur.total, 0);
    },
    totalMoney() {
      return this.tableList.reduce(
        (pre, cur) => pre + cur.total * this.multiple * this.$betPrice,
        0
      );
    },
  },
  props: {
    detail: {
      type: Object,
      default: () => ({}),
    },
    id: {
      type: Number,
      default: null,
    },
    tableList: {
      type: Array,
      default: () => [],
    },
    milliseconds: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    openChase() {
      this.$emit("openChase", {
        multiple: this.multiple, //倍数
        totalALL: this.totalALL, //多数注数
        totalMoney: this.totalMoney, //总金额
      });
    },
    openGroupBuy() {
      this.$emit("openGroupBuy", {
        multiple: this.multiple, //倍数
        totalALL: this.totalALL, //多数注数
        totalMoney: this.totalMoney, //总金额
      });
    },
    async sure() {
      let dataStr = "";
      this.tableList.forEach((v) => {
        //dataStr += `${v.model} ${v.text} ${v.multiple}/`;
        if (!dataStr) {
          dataStr = `${v.model} ${v.text} ${this.multiple} ${v.total}`;
        } else {
          dataStr += `/${v.model} ${v.text} ${this.multiple} ${v.total}`;
        }
      });
      await this.ajaxPay(dataStr);
    },
    async ajaxPay(v) {
      this.$toast.loading({ duration: 0, message: "投注中..." });
      const [err] = await userApi.lotteryBet({
        lotteryId: this.id,
        betCode: v,
      });
      if (err) return;
      this.multiple = 1;
      this.$toast.clear();
      this.close();
      this.$emit("buySuccess");
      this.$toast("投注成功");
    },
    delALL() {
      this.$emit("delALL", 0);
    },
    delOne(i) {
      this.$emit("delOne", i);
    },
    handels() {
      //只能是正整数不是整数默认1
      this.multiple = this.multiple.replace(/[^\d]/g, "") || 1;
    },
    close() {
      this.show = false;
    },
    open() {
      this.show = true;
    },
  },
};
</script>
<style scoped lang="less">
.app-top-bar {
  .right-box {
    color: #fff;
    margin-right: 40px;
    font-size: 26px;
  }
}
.time-box {
  padding: 14px 0;
  text-align: center;
  font-size: 24px;
  color: #777777;
  display: flex;
  justify-content: center;
  align-items: center;
  .time {
    color: #fc4546;
    font-size: 24px;
    margin-left: 10px;
  }
}
.cz-box {
  display: flex;
  background: #e8e8e8;
  padding: 22px 48px;
  justify-content: space-between;
  .left {
    background: #fff;
    height: 54px;
    line-height: 54px;
    padding: 0 18px;
  }
  .right {
    color: #797979;
    font-size: 22px;
    .del-icon {
      background: url("@/assets/img/BetOn/del.png") no-repeat;
      background-size: 100% auto;
      width: 44px;
      height: 44px;
      margin-right: 8px;
    }
  }
}
.item-box {
  margin: 32px 30px;
  border-radius: 8px 8px 8px 8px;
  border: 1px solid #e0e1e0;
  overflow: hidden;
  .lists {
    display: flex;
    border-bottom: 1px solid #e0e1e0;
    align-items: center;
    position: relative;
    &:last-child {
      border-bottom: none;
    }
    &.one {
      background: #fafbfb;
      height: 88px;
      font-weight: 600;
    }
    &.two {
      height: 94px;
      color: #be2933;
      padding: 0 28px;
      .item {
        font-size: 32px;
        font-weight: bold;
        color: #bf2935;
      }
    }
    &.three {
      height: 108px;
      justify-content: space-between;
      padding: 0 28px;
      .right {
        background: #be2933;
        border-radius: 14px 14px 14px 14px;
        font-size: 22px;
        color: #ffffff;
        height: 52px;
        line-height: 52px;
        padding: 0 26px;
      }
    }
    .item {
      flex: 1;
      text-align: center;
      position: relative;
    }
  }
}
.bottom-box {
  .height {
    height: 126px;
  }
  .bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 126px;
    width: 100%;
    background: #000000;
    display: flex;
    align-items: center;
    color: #fff;
    .left {
      margin-left: 18px;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 50px;
      .zhui-btn {
        width: 136px;
        height: 80px;
        color: #ffffff;
        border-radius: 14px 14px 14px 14px;
        background: #545454;
      }
      .num-box {
        display: flex;
        align-items: center;
        .input-box {
          margin: 0 20px;
        }
        .input {
          width: 115px;
          height: 78px;
          text-align: center;
          border-radius: 14px 14px 14px 14px;
          background: #fff;
          color: #333;
        }
      }
      .price {
        color: #ff1726;
      }
    }
    .right {
      width: 180px;
      color: #fff;
      font-size: 32px;
      height: 126px;
      background: #bf2935;
    }
  }
}
</style>
