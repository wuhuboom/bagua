<template>
  <van-popup v-model="show" position="bottom" class="popupPanel">
    <div class="flex-column center-center basketContanier">
      <!-- <AppTopBar topBarTitle="发起合买" :back="close"></AppTopBar> -->
      <div class="align-center space-between head">
        <div class="closeImg"></div>
        <div class="centerTitle">发起合买</div>
        <div class="rigbtn" @click="closePopup">
          <img src="@/assets/img/Glyphs.png" />
        </div>
      </div>

      <div class="content">
        <div class="justify-between periodCon">
          <div class="center-center title">
            距离{{ detail.nextExpect.nextExpect }}期截止时间
          </div>
          <div class="center-center currPer">
            <van-count-down
              class="time"
              :time="milliseconds"
              format="HH:mm:ss"
            />
          </div>
        </div>
        <div class="periodCon">
          <div class="justify-between">
            <div class="center-center title textLeft">
              <p>我要认购</p>
              <p class="title f-24">
                所占比例至少为总金额<span style="color: #fc4546">
                  {{ `${this.lotteryConf.toMin}%` }}</span
                >
              </p>
            </div>
            <div class="center-center currPer">
              <StepInput
                v-model="form.betCountCurr"
                :min="minNumDes"
                :max="maxNum"
                @fatherMultiple="handelBetCountCurr"
                class="custom-stepper hide-stepper"
                input-width="60px"
                :hideType="true"
                :isWelfare="true"
              />
            </div>
          </div>
          <div class="tabPanel">
            <div
              class="tab"
              :boilder-status="form.betCountCurr == item.val * typeTotalMoney"
              v-for="(item, index) in periods"
              :key="index"
              @click="handelTab(item.val)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="periodCon">
          <div class="justify-between">
            <div class="center-center titleWidth">
              <span>是否保底</span>
            </div>
            <div class="center-center currPer rideoWidth">
              <van-radio-group v-model="type">
                <div
                  class="redio-flex"
                  v-for="(item, index) in sysList"
                  :key="index"
                >
                  <van-radio :name="item.id">{{ item.name }}</van-radio>
                </div>
              </van-radio-group>
            </div>
          </div>
          <div v-if="type === 1" class="justify-between justify-top">
            <div class="center-center title textLeft">
              <p>所占比例 {{ typeP }} (至少为总金额的5%)</p>
              <!-- <p class="title f-24">
		  		 
		  		</p> -->
            </div>
            <div class="center-center currPer">
              <StepInput
                v-model="typeMoney"
                hideMinus
                :min="minNumDes"
                :max="maxNum"
                @fatherMultiple="handelTypeMoney"
                class="custom-stepper hide-stepper"
                input-width="60px"
                :hideType="true"
                :isWelfare="true"
              />
            </div>
          </div>
        </div>
        <div class="periodCon down">
          <div class="justify-between">
            <div class="center-center titleWidth">
              <span>是否公开</span>
            </div>
            <div class="center-center currPer rideoWidth">
              <van-radio-group v-model="visibility">
                <div
                  class="redio-flex"
                  v-for="(item, index) in visibilityList"
                  :key="index"
                >
                  <van-radio :name="item.id">{{ item.name }}</van-radio>
                </div>
              </van-radio-group>
            </div>
          </div>
        </div>
      </div>

      <div class="align-center space-between bottom">
        <div class="leftContent">
          <div class="topCon">
            已添加<i>{{ tableList.length }}</i
            >单，共 <span class="numText">{{ bets.totalALL }}</span> 注
            <span class="numText">{{ bets.totalMoney }}</span
            >元
          </div>
          <div class="bottomCon">
            余额：<span class="numText">{{ divide(user.balance) }}</span>
          </div>
        </div>
        <div class="align-center space-between btnBetTool">
          <!-- <div class="zhbtn" @click="openChasePop">追号</div> -->
          <div class="tzbtn" @click="lotteryBets">提交</div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import userApi from "@/api/user";
import StepInput from "./StepInput";
export default {
  name: "BuyTogether",
  components: {
    StepInput,
  },
  data() {
    return {
      maxNum: 9999999999999,
      show: false,
      periods: [
        { val: 0.75, name: "75%" },
        { val: 0.5, name: "50%" },
        { val: 0.25, name: "25%" },
        { val: 0.05, name: "5%" },
      ],
      bets: {
        multiple: 1, //倍数
        totalALL: 0, //多数注数
        totalMoney: 0, //总金额
      },
      lotteryConf: {},
      form: {
        betCountCurr: 1, //认购份数
        betCountMin: 0, //保底份数
      },
      minNum: 0,
      minNumDes: 1,
      type: 0,
      typeMoney: 0,
      isFull: true,
      sysList: [
        {
          name: "无保底",
          id: 0,
        },
        {
          name: "部分保底",
          id: 1,
        },
        {
          name: "全额保底",
          id: 2,
        },
      ],
      openList: false,
      visibilityList: [
        {
          name: "公开",
          id: 0,
        },
        {
          name: "保密",
          id: 3,
        },
        {
          name: "仅对跟单者公开",
          id: 1,
        },
        {
          name: "截止后公开",
          id: 2,
        },
      ],
      visibility: 0,
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
    curType() {
      return this.sysList.find((item) => item.id === this.type);
    },
    typeTotalMoney() {
      return this.bets.totalMoney;
    },
    toMin() {
      return this.lotteryConf.toMin / 100;
    },
    user() {
      return this.$store.state.user;
    },
    currP() {
      let p = (this.form.betCountCurr / this.typeTotalMoney) * 100;
      return `${p.toFixed(2)}%`;
    },
    typeP() {
      let p = (this.typeMoney / this.typeTotalMoney) * 100;
      return `${p.toFixed(2)}%`;
    },
    sysBuy() {
      let orther = 0;
      if (this.type) {
        orther = this.typeMoney;
      }
      return Math.max(0, this.typeTotalMoney - this.form.betCountCurr - orther);
    },
  },
  watch: {
    typeTotalMoney(val) {
      //认购金额至少为总金额的10%
      this.minNum = Math.ceil(val * this.toMin);
    },
  },
  methods: {
    closePopup() {
      this.show = false;
    },
    dataForm() {
      const { betCountCurr } = this.form;
      const obj = {
        betCountCurr,
        ftype: this.isFull ? 1 : 0,
        betCountMin: 0,
        btype: 2, // Default to no保底
        visibility: this.visibility,
      };

      if (this.type === 1) {
        // 部分保底
        obj.betCountMin = this.typeMoney;
        obj.btype = 1;
      } else if (this.type === 2) {
        // 全额保底
        obj.betCountMin = this.typeTotalMoney;
        obj.btype = 0;
        obj.ftype = 0;
      }

      return obj;
    },
    comfire(v) {
      return new Promise((resolve) => {
        this.$dialog
          .confirm({
            message: v,
            confirmButtonColor: "#3291FF",
            className: "confirm-no-tile-dialog",
          })
          .then(() => {
            resolve(1);
          })
          .catch(() => {
            resolve(0);
          });
      });
    },
    async betsShare(id) {
      this.$toast.loading({
        forbidClick: false, // 允许点击和滚动
        duration: 0, // 持续时间为 0 表示不会自动关闭
      });
      const [err] = await userApi.lotteryBetsShare({
        id,
      });
      this.sleep(1000);
      this.$toast.clear();
      if (err) return;
      this.$toast.success("分享成功");
    },
    async chat(id) {
      const [err, res] = await userApi.chat();
      if (err) return;
      if (!res.data?.chatAble || res.data?.shareDisabled === 0) return;
      const status = await this.comfire("合买成功分享到聊天室吗？");
      if (!status || !id) return;
      this.betsShare(id);
    },
    async lotteryBets() {
      if (this.form.betCountCurr < this.minNum) {
        this.$toast.fail(`认购金额至少为总金额的${this.lotteryConf.toMin}%`);
        // this.form.betCountCurr = this.minNum;
        return;
      } else if (this.form.betCountCurr > this.typeTotalMoney) {
        this.$toast.fail(`认购金额不能大于总金额`);
        // this.form.betCountCurr = this.typeTotalMoney;
        return;
      }
      if (this.typeMoney < this.minType) {
        this.$toast.fail(`保底金额至少为总金额的5%`);
        return;
        // this.typeMoney = this.minType;
      } else if (this.typeMoney > this.typeTotalMoney) {
        this.$toast.fail(`保底金额不能大于总金额`);
        return;
        // this.typeMoney = this.typeTotalMoney;
      }
      const [err, res] = await userApi.lotteryBets({
        lotteryId: this.id,
        betCode: this.$util.getStrs(this.tableList),
        ...this.dataForm(),
      });
      if (err) return;
      this.close();
      this.$emit("buySuccess");
      this.$toast("合买成功");
      this.chat(res.data?.id);
    },
    handelTab(v) {
      let n = Math.ceil(v * this.typeTotalMoney);
      if (!n) return;
      // n = v.target.value.replace(/[^\d]/g, "") || this.minNum;
      if (n < this.minNum) {
        this.$toast.fail(`认购金额至少为总金额的${this.lotteryConf.toMin}%`);
        this.form.betCountCurr = this.minNum;
      } else if (n > this.typeTotalMoney) {
        this.$toast.fail(`认购金额不能大于总金额`);
        this.form.betCountCurr = this.typeTotalMoney;
      } else {
        this.form.betCountCurr = n;
      }
    },
    handelBetCountCurr(paramItem) {
      let n = paramItem.multiple;
      if (!n) return;
      this.form.betCountCurr = n;
      // if (n == 0){
      //  this.form.betCountCurr = 1;
      // }
    },
    handelTypeMoney(paramItem) {
      let n = paramItem.multiple;
      if (!n) return;
      this.typeMoney = n;
      // n = v.target.value.replace(/[^\d]/g, "") || this.minType;
    },
    select(item) {
      this.type = item.id;
    },
    openSheet() {
      this.$refs.$BtmActionSheet.open();
    },
    async getlotteryConf() {
      this.$toast.loading({
        forbidClick: false, // 允许点击和滚动
        duration: 0, // 持续时间为 0 表示不会自动关闭
      });
      const [err, res] = await userApi.lotteryConf();
      this.$toast.clear();
      if (err) return;
      this.lotteryConf = res.data;
    },
    async open(v) {
      if (this.tableList.length === 0) {
        this.$toast.fail(`请先选择投注`);
        return;
      }
      await this.getlotteryConf();
      if (v) {
        this.bets = v;
      }
      const num = +this.typeTotalMoney || 0;
      this.minNum = Math.ceil(num * this.toMin);
      this.minType = Math.ceil(num * 0.05);
      this.typeMoney = this.minType;
      this.form.betCountCurr = +this.minNum;
      this.show = true;
    },
    close() {
      this.show = false;
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
}

.time {
  color: #fc4546;
  font-size: 24px;
  margin-left: 10px;
}
.zq-box {
  height: 94px;
  background: #e8e8e8;
  color: #999999;
  font-weight: 500;

  .input {
    height: 54px;
    width: 146px;
    background: #ffffff;
    border: 1px solid #999999;
    text-align: center;
    margin: 0 32px;
    color: #333;
    font-weight: bold;
  }
}

.table-box {
  padding: 0 30px;

  .row {
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
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
    }
  }

  .header {
    color: #6a6a6a;
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
.nav {
  height: 80px;
  width: 100%;
}
.down {
  margin-bottom: 160px;
}
.bottom-box {
  .height {
    height: 260px;
  }

  .b-fixed {
    // position: fixed;
    // left: 0;
    // bottom: 0;
    // width: 100%;
    // background: #fff;

    .radio-box {
      width: 100%;
      // padding-top: 28px;
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

        .realPer {
        }
      }
    }

    .appendPer {
      width: 100%;
      height: 246px;

      .appendTitle {
      }

      .appendNum {
      }

      .appendChosee {
      }
    }
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

.redio-flex {
  display: inherit;
  float: left;
  margin: 8px 0;
  ::v-deep .van-radio__label {
    // margin-left: 4px;
    margin-right: 20px;
  }
  ::v-deep .van-radio__icon--round .van-icon {
    border-radius: 8px;
  }
  ::v-deep .van-radio__icon--checked .van-icon {
    background-color: #fff;
    border-color: #bf2935;
    color: #bf2935;
  }
}
.justify-top {
  margin-top: 40px;
}
.textLeft {
  display: initial !important;
  text-align: left !important;
}
.titleWidth {
  width: 140px !important;
  justify-content: left !important;
}
.rideoWidth {
  justify-content: left !important;
  width: calc(100% - 170px) !important;
}
.tabPanel {
  margin-top: 40px;
  width: 100%;
  height: 60px;
}
.tab {
  border: 2px solid #d2d2d2;
  font-size: 24px;
  color: #666666;
  border-radius: 6px;
  margin: 0 10px;
  padding: 10px 40px;
  float: right;
}
.tab[boilder-status="true"] {
  color: #fff !important;
  background: #bf2935 !important;
  border: 2px solid #bf2935 !important;
}
::v-deep .van-checkbox__icon--round .van-icon {
  border-radius: 8px !important;
}
::v-deep .van-checkbox__icon--checked {
  border-color: #c8c9cc;
  background-color: #fff;
  color: #bf2935;
}
</style>
