<template>
  <van-popup class="bind-bet-pop" v-model="show" position="bottom">
    <div class="font12">
      <ul class="title-bets center-center p-l-24 p-r-24">
        <li class="font12">
          <span class="color999">账户余额:</span> {{ divide(user.balance) }}
        </li>
        <li class="font16">跟投计划</li>
        <li @click="show = false"><van-icon name="cross" :size="16" /></li>
      </ul>
      <div class="stepper" v-if="detail.status > 2">
        <div
          class="p-l-24 p-r-24"
          v-for="(item, index) in detail.expects"
          :key="index"
        >
          <ul class="color999 justify-between p-b-24">
            <li class="d-flex">
              <img
                class="d-img beting"
                src="@/assets/img/finishend.png"
                alt=""
              />
              {{ item.expect }}期
            </li>
            <li style="text-align: right">
              <p class="p-b-4">开奖结果</p>
              <p class="font14" style="color: #ff4d3e">
                {{ item.open?.replace(/,/g, " ") }}
              </p>
            </li>
          </ul>
          <template v-if="!detail.betCode">
            <ul class="justify-between m-b-16 align-center">
              <template>
                <li>{{ "****" }}</li>
                <li>{{ "****" }}</li>
                <li :class="{ red: detail.openStatus === 2 }">
                  {{ detail.openStatus === 2 ? "中奖" : "未中奖" }}
                </li>
              </template>
            </ul>
          </template>
          <template v-else>
            <ul
              class="m-b-16 infoli"
              v-for="(subItem, subIndex) in item.details"
              :key="subIndex"
            >
              <div class="lotteryBox justify-between">
                <li>{{ subItem.name || "****" }}</li>
                <li :class="{ red: subItem.win > 0 }">
                  {{ subItem.win > 0 ? "中奖" : "未中奖" }}
                </li>
              </div>
              <li class="lotteryBoxItem">{{ subItem.txtCode || "****" }}</li>
            </ul>
          </template>
        </div>
      </div>
      <div class="p-l-24 p-r-24" v-else>
        <div>
          <ul class="detail-msg">
            <li>
              <div class="justify-between p-b-24 color999">
                <div class="align-center">
                  <img
                    v-if="isCna"
                    class="d-img beting m-r-16"
                    src="@/assets/img/beting-sign.png"
                    alt=""
                  />
                  <img
                    v-else
                    class="d-img beting m-r-16"
                    src="@/assets/img/finishend.png"
                    alt=""
                  />
                  <p>{{ detail.expect }}期</p>
                </div>
                <div v-if="detail.lottery?.nextExpect.countdown">
                  <div>距离截止时间</div>
                  <div>
                    <van-count-down
                      @finish="openFish"
                      :time="detail.lottery?.nextExpect.countdown * 1000"
                    >
                      <template #default="timeData">
                        <div class="timeData d-flex">
                          <span class="block center-center">{{
                            timeData.hours >= 10
                              ? timeData.hours
                              : `0${timeData.hours}`
                          }}</span>
                          <span class="colon center-center">:</span>
                          <span class="block center-center">{{
                            timeData.minutes >= 10
                              ? timeData.minutes
                              : `0${timeData.minutes}`
                          }}</span>
                          <span class="colon center-center">:</span>
                          <span class="block center-center">{{
                            timeData.seconds >= 10
                              ? timeData.seconds
                              : `0${timeData.seconds}`
                          }}</span>
                        </div>
                      </template>
                    </van-count-down>
                  </div>
                </div>
              </div>
              <p class="p-b-24 font14">{{ detail.lottery?.lotteryName }}</p>
              <p
                class="p-b-24 align-center"
                v-for="(item, index) in betCode"
                :key="index"
              >
                <span class="no-shrink m-r-16">{{ item.name }}</span>
                <span class="x-auto flex-1" style="white-space: nowrap">
                  <!-- {{
                    item.positions?.map((subArr) => subArr.join("")).join("|")
                  }} -->
                  {{ item | showRealContent }}
                </span>
              </p>
            </li>
          </ul>
          <ul class="justify-between stepper align-center m-t-24">
            <li class="flex-1">
              <van-field
                v-model="detail.clientMoney"
                type="number"
                placeholder="请输入金额"
                @input="validateMoney"
              />
            </li>
          </ul>
        </div>
      </div>

      <ul class="center-center money-list">
        <li class="center-center">
          总金额<span class="m-l-4 m-r-4 reds">¥{{ divide(detail.money) }}</span
          >元
        </li>
      </ul>
      <ul class="p-x-32 justify-around buy-btm font14">
        <li class="flex-column center-center" @click="buyPlayer('all')">
          <p>剩余:{{ detail.sellCount }}元</p>
          <p>全包</p>
        </li>
        <!-- getStatus(detail.status) -->
        <li
          @click="buyPlayer(detail.clientMoney)"
          class="center-center"
          :class="{
            ends: !isCna,
          }"
        >
          {{ !isCna ? "已结束" : "直接下注" }}
        </li>
      </ul>
    </div>
    <tipsDialog ref="$tipsDialog" />
    <tipsDialog ref="$buyDialog" @sure="mySure" />
    <tipsDialog ref="$canAllDialog" @sure="ALLSure" />
    <tipsDialog ref="$canOneDialog" @sure="OneSure" />
  </van-popup>
</template>

<script>
import userApi from "@/api/user";
import { mapGetters } from "vuex";
export default {
  name: "bindBetPop",
  data() {
    return {
      show: false,
      id: null,
      detail: {},
      expect: "",
      shareData: {
        // chatAble
        // recharge 3000
      },
    };
  },
  filters: {
    showRealContent: (str) => {
      console.log("strcccc", str.positions);
      let arr = str.positions;
      if (arr?.length === 1) {
        // 只有一个数组，直接用竖线连接
        return arr[0].join("|");
      } else {
        // 多个数组，用竖线连接每个子数组
        return arr?.map((subArr) => subArr.join("")).join("|");
      }

      // const result = Array.isArray(str.positions[0])
      //   ? str.positions.map(subArr => subArr.join("|")).join("|")
      //   : str.positions.join("|");
      // return result
    },
  },
  computed: {
    ...mapGetters(["catList"]),
    betCode() {
      console.log(this.detail);
      if (this.detail.betCode) {
        return this.$util.parseFourStarInputNormal(this.detail.betCode);
      }
      return [];
    },
    quantity() {
      // 遍历 betCode。quantity;
      console.log(this.betCode);
      return this.betCode.reduce((acc, cur) => {
        return acc + cur.quantity;
      }, 0);
    },
    user() {
      return this.$store.state.user;
    },
    theOne() {
      return this.$store.state.theOne;
    },
    cat() {
      return [...this.$store.state.cat];
    },
    curCat() {
      let catData = {};
      this.cat.forEach((v) => {
        v.list.forEach((c) => {
          if (+c.id === +this.detail.lotteryId) {
            catData = v;
          }
        });
      });
      return catData;
    },
    isMe() {
      return +this.user.id === +this.detail?.playerId;
    },
    isCna() {
      return this.detail.sellCount && +this.detail.status === 0;
    },
  },
  methods: {
    validateMoney(value) {
      // 过滤掉非数字，并确保不小于 0
      this.detail.clientMoney = value
        .replace(/[^0-9.]/g, "")
        .replace(/^0+(\d)/, "$1");
    },
    async openFish() {
      await Promise.all([this.getDetail(), this.chat()]);
    },
    async open(v) {
      this.id = v;
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      await Promise.all([this.getDetail(), this.chat()]);
      this.show = true;
      this.$toast.clear();
    },
    countPrice(item) {
      if (this.theOne.includes(item.name)) {
        return item.price;
      }
      return item.quantity * item.multiplier * item.price;
    },
    copy(v) {
      navigator.clipboard.writeText(v).then(() => {
        this.$toast("复制成功");
      });
    },
    getOpenStatus(v) {
      const item = this.$store.state.openStatus.find((d) => d.id === v);
      return item ? item.name : "";
    },
    async cancelAll() {
      this.$refs.$canAllDialog.open("确定要撤销吗？");
    },
    async ALLSure() {
      const [err] = await userApi.cancelTogether({
        id: this.id,
      });
      if (err) return;
      this.$toast.success("撤销成功");
      this.getDetail();
    },
    async cancel(expect) {
      this.expect = expect;
      this.$refs.$canOneDialog.open("确定要撤销吗？");
    },
    async OneSure() {
      const [err] = await userApi.lotteryMyOrderCancelRe2({
        expect: this.expect,
        id: this.id,
      });
      if (err) return;
      this.$toast.success("撤销成功");
      this.getDetail();
    },
    onCopySuccess() {
      this.$toast.success("复制链接成功");
    },
    getName(id) {
      const item = this.catList.find((v) => v.id === id);
      return item ? item.lotteryName : "";
    },
    getOpen(v) {
      if (!v) return ["_", "_", "_", "", "_"];
      return v.split(",").filter((v) => v);
    },
    showContent(v) {
      //visibility 0公开 1仅对跟单者公开 2截止后公开 3永久保密
      if (v === 0) {
        return true;
      }
      if (v === 1) {
        return this.detail.joins.some((v) => v.playerId === this.user.id);
      }
      if (v === 2) {
        return +this.detail.status === 4;
      }
      return false;
    },
    getVisibility(v) {
      const docs = [
        {
          name: "公开",
          status: 0,
        },
        {
          name: "仅对跟单者公开",
          status: 1,
        },
        {
          name: "截止后公开",
          status: 2,
        },
        {
          name: "永久保密",
          status: 3,
        },
      ];
      return (docs.find((doc) => doc.status === v) || {}).name;
    },
    getBtype(v) {
      // 0 btype 是否保底0全保 1部分 2不保
      const docs = [
        {
          name: "全额保底",
          status: 0,
        },
        {
          name: "部分保底",
          status: 1,
        },
        {
          name: "不保底",
          status: 2,
        },
      ];
      return (docs.find((doc) => doc.status === v) || {}).name;
    },
    getReType(v) {
      // 0 无追号 1中奖停 2中奖不停
      const docs = [
        {
          name: "无追号",
          status: 0,
        },
        {
          name: "中奖停",
          status: 1,
        },
        {
          name: "中奖不停",
          status: 2,
        },
      ];
      return (docs.find((doc) => doc.status === v) || {}).name;
    },
    validateInput(item, v) {
      let value = v.target.value.replace(/\D/g, "");
      if (value) {
        const numericValue = parseInt(value, 10);
        value = Math.min(Math.max(numericValue, 1), item.sellCount);
      }
      item.clientMoney = value;
    },
    buyPlayer(price) {
      if (!this.isCna) {
        this.$toast("合买已结束");
        return;
      }
      if (!price) {
        this.$refs.$tipsDialog.open("请输入购买金额");
        return;
      }
      if (price === "all") {
        this.detail.clientMoney = this.detail.sellCount;
        this.$refs.$buyDialog.open(
          `全包金额: ${this.detail.clientMoney}元，确定全包?`
        );
        return;
      }

      if (price > this.detail.sellCount) {
        this.$refs.$tipsDialog.open("购买金额不能大于剩余金额");
        return;
      }
      this.$refs.$buyDialog.open(`认购金额：￥${this.detail.clientMoney}`);
    },
    getExpects(v) {
      return (this.$store.state.openStatus.find((doc) => doc.id === v) || {})
        .name;
    },
    getStatus(v) {
      return (this.$store.state.status.find((doc) => doc.id === v) || {}).name;
    },
    btmStatus(v) {
      return (this.$store.state.btmStatus.find((doc) => doc.id === v) || {})
        .name;
    },
    async chat() {
      const [err, res] = await userApi.chat();
      if (err) return;

      this.shareData = res.data;
    },
    async mySure() {
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      const [err] = await userApi.lotteryBetsJoin({
        betId: this.detail.id,
        betCount: this.detail.clientMoney,
      });
      if (err) return;
      this.detail.clientMoney = "";
      this.$toast.success("购买成功");

      this.show = false;
    },
    async getDetail() {
      const [err, res] = await userApi.betsOrderDetail({
        id: this.id,
      });
      if (err) return;
      res.data.clientMoney = "";
      res.data.betCountCurr = res.data.betCountCurr / 100;
      res.data.betTotal = res.data.betTotal / 100;
      res.data.sellCount = res.data.betTotal - res.data.betCountCurr;
      res.data.betListArr = res.data.betCode
        ? this.$util.parseFourStarInputNormal(res.data.betCode)
        : [];
      res.data?.expects?.forEach((v) => {
        v?.details?.forEach((c) => {
          const arr = this.$util.parseFourStarInputNormal(c.code);
          if (arr.length) {
            const item = arr[0];

            let iTArr = item.positions;

            Object.assign(c, {
              name: item.name,
              // txtCode: item?.positions
              //   ?.map((subArr) => subArr.join(""))
              //   .join("|"),
              txtCode:
                iTArr?.length === 1
                  ? iTArr[0].join("|")
                  : iTArr?.map((subArr) => subArr.join("")).join("|"),
            });
          }
        });
      });
      //res.data.clientMoney = res.data.sellCount;
      for (let key in res.data) {
        this.$set(this.detail, key, res.data[key]);
      }
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
    async shareToChatRoom() {
      if (+this.shareData.shareDisabled === 0) {
        this.$toast.fail(`分享已禁用`);
        return;
      }
      if (this.detail.status !== 0) {
        this.$toast("合买已结束，无法分享");
        return;
      }
      if (!this.shareData.chatAble) {
        this.$toast(`充值${this.shareData.recharge}才能解锁聊天`);
        return;
      }
      const status = await this.comfire("确定分享到聊天室吗？");
      if (!status) return;
      this.$toast.loading({
        forbidClick: false, // 允许点击和滚动
        duration: 0, // 持续时间为 0 表示不会自动关闭
      });
      const [err] = await userApi.lotteryBetsShare({
        id: this.id,
      });
      this.sleep(1000);
      this.$toast.clear();
      if (err) return;
      this.$toast.success("分享成功");
    },
  },
};
</script>
<style scoped lang="scss">
.bind-bet-pop {
  border-radius: 24px 24px 0px 0px;
}
.lotteryBox {
  width: 100%;
}
.lotteryBoxItem {
  margin-top: 26px;
  font-size: 24px;
}

.repaly-txt {
  background: #ffffff;
  border-radius: 10px 10px 10px 10px;
  border: 2px solid #f0f0f0;
}

.replays {
  background-color: #f5f5f5;
}

.title-bets {
  width: 100%;
  height: 126px;
  border-bottom: 2px solid #e5e5e5;
  position: relative;
  margin-bottom: 36px;

  & > li:nth-child(1) {
    position: absolute;
    left: 24px;
    top: 50%;
    transform: translateY(-50%);
  }

  & > li:nth-child(3) {
    position: absolute;
    right: 24px;
    top: 50%;
    transform: translateY(-50%);
  }
}

.beting {
  width: 94px;
  height: 32px;
  margin-right: 10px;
}

.timeData {
  justify-content: flex-end;
  color: #ff4d3e;
}

.detail-msg {
  border-bottom: 2px dashed #e5e5e5;
}

.stepper {
  margin-bottom: 300px;

  ::v-deep {
    .van-cell {
      background-color: #fafafa;
    }
  }
}

.money-list {
  height: 68px;
  background: #ffe0e2;

  .reds {
    color: #e50012;
  }
}

.buy-btm {
  color: #fff;

  & > li {
    width: 298px;
    height: 90px;
    background: #5d7aff;
    border-radius: 12px 12px 12px 12px;
  }

  & > li:last-child {
    background: #bf2935;
  }

  & > li.ends {
    background: #999999;
  }
}

.red {
  color: #ff4d3e;
}

.infoli {
  border-bottom: 1px dashed #e5e5e5;
  padding-bottom: 16px;
  li {
    &:nth-child(1) {
      width: 200px;
      flex-shrink: 0;
      /* 固定宽度，不被压缩 */
    }

    &:nth-child(2) {
      // flex: 1;
      /* 自动适配剩余空间 */
      // min-width: 100px;
      /* 防止过小 */

      word-wrap: break-word;
      word-break: break-word;
    }

    &:nth-child(3) {
      width: 100px;
      flex-shrink: 0;
      text-align: center;
      /* 居中对齐 */
    }
  }
}
</style>
