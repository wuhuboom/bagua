<template>
  <van-popup
    v-model="show"
    position="bottom"
    class="custom-popup popupPanel"
    round
    @close="closePopup"
  >
    <div>
      <!-- <AppTopBar :back="close" topBarTitle="自动追期"></AppTopBar> -->
      <div class="flex-column center-center basketContanier">
        <div class="align-center space-between head">
          <div class="closeImg"></div>
          <div class="centerTitle">追号</div>
          <div class="rigbtn" @click="closePopup">
            <img src="@/assets/img/Glyphs.png" />
          </div>
        </div>
        <div class="content">
          <div class="justify-between periodCon">
            <div class="center-center title">
              <div class="center-center boxcurr">当前期</div>
              <div class="realPer">{{ detail.nextExpect.nextExpect }}期</div>
            </div>
            <div class="center-center currPer">
              <van-count-down
                class="time"
                :time="milliseconds"
                format="HH:mm:ss"
              />截止
            </div>
          </div>

          <div class="appendPer">
            <div class="zq-box center-center">
              追
              <input
                type="text"
                class="input"
                v-model="period"
                @input="changePeriod"
              />
              期
            </div>
            <div class="table-box">
              <div class="row header">
                <div class="col" style="display: block; text-align: center">
                  期数
                </div>
                <div class="col">倍数</div>
                <div class="col">单倍金额</div>
                <div class="col">当前投入</div>
              </div>
              <div class="row" v-for="(v, i) in list" :key="i">
                <div class="col align-center" @click="choseRow(i)">
                  <van-checkbox
                    class="m-r-8 no-shrink"
                    icon-size="12px"
                    v-model="v.checked"
                    checked-color="#ee0a24"
                  ></van-checkbox>
                  <p class="flex-1">{{ v.name }}期</p>
                </div>
                <div class="col">
                  <!-- <input type="text" v-model="v.multiplier" class="input" /> -->
                  <StepInput
                    v-model="v.multiplier"
                    @fatherMultiple="recvSubMultiple"
                    :currItemData="v"
                    :currIdex="i"
                    type="currency"
                    hideMinus
                    :hideType="true"
                    :isWelfare="true"
                  />
                </div>
                <div class="col num">
                  {{ divide(bets.totalMoney, false) }}元
                </div>
                <div class="col">
                  {{ divide(v.multiplier * bets.totalMoney, false) }}元
                </div>
              </div>
            </div>
          </div>
          <div class="justify-between center-box">
            <div class="time-box center-center">
              <span class="name">追停方式:</span>
              <van-checkbox
                v-model="radio"
                icon-size="16px"
                checked-color="#ee0a24"
                >中奖即停</van-checkbox
              >
            </div>
          </div>
        </div>
        <div class="align-center space-between bottom">
          <div class="leftContent">
            <div class="topCon">
              共 <span class="numText">{{ chaseToal }}</span> 注
              <span class="numText">{{ chaseMoney }}</span
              >元
            </div>
            <div class="bottomCon">
              余额：<span class="numText">{{ divide(user.balance) }}</span>
            </div>
          </div>
          <div class="align-center space-between btnBetTool">
            <div class="tzbtn" @click="lotteryBetsRes">提交</div>
          </div>
        </div>
      </div>

      <!-- <div class="zq-box center-center">
		  追
		  <input type="text" class="input" v-model="period" @input="changePeriod" />
		  期
		</div>
		<div class="table-box">
		  <div class="row header">
		    <div class="col">期数</div>
		    <div class="col">倍数</div>
		    <div class="col">单倍金额</div>
		    <div class="col">当前投入</div>
		  </div>
		  <div class="row" v-for="(v, i) in list" :key="i">
		    <div class="col align-center" @click="choseRow(i)">
		      <van-checkbox class="m-r-8 no-shrink" icon-size="12px" v-model="v.checked"
		        checked-color="#ee0a24"></van-checkbox>
		      <p class="flex-1">{{ v.name }}期</p>
		    </div>
		    <div class="col">
		      <input type="text" v-model="v.multiplier" class="input" />
		    </div>
		    <div class="col num">{{ divide(bets.totalMoney, false) }}元</div>
		    <div class="col">
		      {{ divide(v.multiplier * bets.totalMoney, false) }}元
		    </div>
		  </div>
		</div>
		<p class="m-t-20 total-msg center-center">
		  总注数<span>{{ chaseToal }}</span>,总金额<span>{{ chaseMoney }}</span>元
		</p>
		<div class="bottom-box">
		  <div class="height"></div>
		  <div class="b-fixed">
		    <div class="radio-box center-center">
		      <van-checkbox v-model="radio" icon-size="16px" checked-color="#ee0a24">中奖后停止追号</van-checkbox>
		    </div>
		    <div class="btn center-center" @click="lotteryBetsRes">提交</div>
		  </div>
		</div> -->
    </div>
  </van-popup>
</template>

<script>
import userApi from "@/api/user";
import StepInput from "./StepInputByAppend";
export default {
  name: "AppendChase",
  components: {
    StepInput,
  },
  data() {
    return {
      period: 2,
      radio: 1,
      show: false,
      list: [],
      bets: {
        multiple: 1, //倍数
        totalALL: 0, //多数注数
        totalMoney: 0, //总金额
      }, //投注信息
    };
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
  computed: {
    chaseToal() {
      return (
        this.list.filter((item) => item.checked).length * this.bets.totalALL
      );
    },
    chaseMoney() {
      return this.list.reduce((pre, cur) => {
        if (cur.checked) {
          return pre + cur.multiplier * this.bets.totalMoney;
        }
        return pre;
      }, 0);
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    closePopup() {
      this.period = 2;
      this.show = false;
    },
    recvSubMultiple(paramItem, paramIndex) {
      this.$set(this.list, paramIndex, {
        ...this.list[paramIndex],
        ...paramItem,
      });
    },
    changePeriod(v) {
      let n = v.target.value.trim();
      if (!n) return;
      n = v.target.value.replace(/[^\d]/g, "") || 2;
      if (n < 2) {
        n = 2;
      }
      if (n > 5) {
        n = 5;
      }
      this.period = n;
      const count = this.list.filter((item) => item.checked).length;
      if (n === count) {
        return;
      }
      this.list.forEach((item, idx) => {
        if (idx < this.period) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    },
    choseRow(idx) {
      this.list[idx].checked = !this.list[idx].checked;
      this.period = this.list.filter((item) => item.checked).length;
    },
    dataForm() {
      const obj = {
        stop: this.radio ? 1 : 0,
        content: "",
      };
      console.log(this.list);
      const list = this.list.filter((item) => item.checked);
      list.forEach((item) => {
        if (!obj.content) {
          obj.content = `${item.name},${item.multiplier}`;
        } else {
          obj.content += `|${item.name},${item.multiplier}`;
        }
      });
      return obj;
    },
    async lotteryBetsRes() {
      const nums = this.list.filter((item) => item.checked).length;
      //2-5期
      if (nums < 2) {
        this.$toast("追号期数不能少于2期");
        return;
      }
      if (nums > 5) {
        this.$toast("追号期数不能大于5期");
        return;
      }
      const params = {
        lotteryId: this.id,
        ...this.dataForm(),
        betCode: this.$util.getStrs(this.tableList),
        together: 0,
      };
      this.$toast.loading({ duration: 0, message: "投注中..." });
      const [err] = await userApi.lotteryBetsRe(params);
      if (err) return;
      this.close();
      this.$emit("buySuccess");
      this.$toast("追号成功");
    },
    delALL() {
      this.$emit("delALL", 0);
    },
    async getList() {
      const [err, res] = await userApi.lotteryExpects({
        id: this.id,
      });
      if (err) return;
      res.data = res.data.slice(0, 5);
      this.list = res.data.map((item, idx) => {
        console.log("this.list", this.list);
        return {
          name: item,
          checked: [0, 1].includes(idx) ? true : false,
          multiplier: 1,
        };
      });
    },
    async open(v) {
      if (this.tableList.length === 0) {
        this.$toast("请先选择投注");
        return;
      }
      this.$toast.loading({ duration: 0 });
      await this.getList();
      this.$toast.clear();
      this.bets = v;
      this.show = true;
    },
    close() {
      this.period = 2;
      this.show = false;
    },
    changeRadio() {
      this.radio = this.radio == 1 ? 0 : 1;
    },
  },
};
</script>
<style scoped lang="less">
.popupPanel {
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
}
.time-box {
  padding: 14px 0;
  text-align: center;
  font-size: 24px;
  color: #777777;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  .name {
    margin-right: 36px;
  }
}

.time {
  color: #bf2935;
  font-size: 24px;
  margin-left: 10px;
  margin-right: 10px;
}

.zq-box {
  height: 94px;
  background: #e8e8e8;
  color: #999999;
  font-weight: 500;

  .input {
    height: 54px;
    width: 146px;
    border-radius: 12px;
    background: #ffffff;
    color: #242424;
    border: 1px solid #999999;
    text-align: center;
    margin: 0 32px;
    font-weight: bold;
  }
}

.table-box {
  padding: 0 30px;

  .row {
    display: grid;
    grid-template-columns: 25% 35% 20% 20%;
    border-bottom: 1px solid #efefef;
    font-size: 24px;
    color: #777777;
    padding: 24px 0;
    align-items: center;
    text-align: center;
  }

  .col {
    &:first-child {
      text-align: left;
      display: -webkit-box;
      justify-content: center;
      // height:100%;
      // line-height: 100%;
    }
    &:nth-child(2) {
      justify-content: center;
      display: flex;
      .stepper {
        width: 180px;
      }
    }
  }

  .header {
    color: #999999;
    font-weight: bold;
  }

  .input {
    width: 110px;
    height: 54px;
    text-align: center;
    border: 1px solid #d1d1d1;
    color: #000;
    font-weight: 500;
    font-size: 24px;
  }

  .num {
    color: #be2933;
  }
}

.bottom-box {
  .height {
    height: 260px;
  }

  .b-fixed {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;

    .radio-box {
      width: 100%;
      padding-top: 28px;
    }

    .btn {
      width: 684px;
      height: 92px;
      background: #be2834;
      margin: 28px auto;
      font-size: 32px;
      font-weight: 500;
      color: #ffffff;
    }
  }
}

.total-msg {
  font-size: 32px;

  span {
    color: #be2933;
  }
}

/deep/.custom-popup .van-overlay {
  background-color: rgba(0, 0, 0, 0.2) !important;
}

.basketContanier {
  width: 100%;
  position: relative;
  height: 100%;
  /* 让容器填满弹出层 */

  .head {
    padding: 40px;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    position: absolute;
    /* 让它相对 .basketContanier 定位，而不是根目录 */
    top: 0;
    width: 100%;
    z-index: 10;
    /* 确保在内容上方 */
    background: #fff;

    .closeImg {
      img {
        width: 33.06px;
        height: 33.06px;
        vertical-align: middle;
      }
    }

    .centerTitle {
      margin-left: 10px;
      font-family: PingFang HK, PingFang HK;
      font-weight: 400;
      font-size: 32px;
      color: #000000;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }

    .rigbtn {
      font-family: PingFang HK, PingFang HK;
      font-weight: 400;
      font-size: 24px;
      color: #000000;
      text-align: center;
      font-style: normal;
      text-transform: none;

      img {
        width: 33.06px;
        height: 33.06px;
        vertical-align: middle;
      }
    }
  }

  .content {
    width: 100%;
    max-height: calc(100vh - 158px);
    flex: 1;
    /* 让内容自动占据剩余空间 */
    overflow-y: auto;
    /* 允许滚动 */
    padding-top: 120px;
    /* 预留 .head 的空间，避免遮挡 */

    padding-bottom: 200px;
    /* 预留 .bottom 的空间 */

    font-family: PingFang HK, PingFang HK;
    font-weight: 400;
    font-size: 24px;
    color: #242424;
    text-align: center;
    font-style: normal;
    text-transform: none;

    .periodCon {
      padding: 30px 46px 18px 36px;
      border-bottom: 1px solid #e5e5e5;

      .currPer {
        .realPer {
        }
      }

      .boxcurr {
        width: 96px;
        height: 48px;

        background: #bf2935;
        border-radius: 6px;
        font-family: PingFang HK, PingFang HK;
        font-weight: 400;
        font-size: 24px;
        color: #ffffff;
        text-align: center;
        font-style: normal;
        text-transform: none;

        margin-right: 16px;
      }
    }

    .appendPer {
      width: 100%;
    }
  }

  .center-box {
    display: inherit;
    margin-top: 30px;
  }

  .bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 158px;
    background: #fff;
    box-shadow: 6px 0px 12px 2px rgba(0, 0, 0, 0.16);

    padding: 0 20px;

    .leftContent {
      .topCon,
      .bottomCon {
        font-family: PingFang HK, PingFang HK;
        font-weight: 400;
        font-size: 24px;
        color: #000000;
        text-align: left;
        font-style: normal;
        text-transform: none;

        .numText {
          color: #f19838;
        }
      }

      .topCon {
      }

      .bottomCon {
        margin-top: 10px;
      }
    }

    .btnBetTool {
      .zhbtn {
        background: #ffdee1;
        border-radius: 12px;
        border: 2px solid #bf2834;

        font-family: PingFang HK, PingFang HK;
        font-weight: 400;
        font-size: 30px;
        color: #e50012;
        text-align: center;
        font-style: normal;
        text-transform: none;

        padding: 24px 32px;
      }

      .tzbtn {
        margin-left: 20px;
        padding: 24px 32px;
        background: #bf2935;
        border-radius: 12px;

        font-family: PingFang HK, PingFang HK;
        font-weight: 400;
        font-size: 30px;
        color: #ffffff;
        text-align: center;
        font-style: normal;
        text-transform: none;
      }
    }
  }
}
.no-shrink {
  display: block;
}
.time-box {
  ::v-deep .van-checkbox__icon--round .van-icon {
    border-radius: 8px !important;
  }
  ::v-deep .van-checkbox__icon--checked {
    border-color: #c8c9cc;
    background-color: #fff;
    color: #bf2935;
  }
  ::v-deep .van-checkbox__icon--checked .van-icon {
    background-color: #fff !important;
    border-color: #bf2935 !important;
    color: #bf2935 !important;
  }
}
</style>
