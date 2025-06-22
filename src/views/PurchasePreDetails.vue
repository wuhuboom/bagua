<template>
  <div class="c-page bg-grey font12">
    <AppTopBar topBarTitle="追号详情"> </AppTopBar>
    <div class="center-center m-t-24" v-if="!detail.id">
      <van-loading color="#bf2935" />
    </div>
    <div v-else>
      <ul
        class="nav font16 bg-fff m-b-24 align-center justify-between p-l-24 p-r-24"
      >
        <li class="align-center">
          <p class="icoUrls m-r-16">
            <img class="d-img" :src="lottery.icoUrls" alt="" />
          </p>
          {{ lottery.lotteryNameH5 }}
        </li>
        <li
          class="font12 align-center"
          v-clipboard:copy="detail.orderId"
          v-clipboard:success="onCopySuccess"
        >
          单号:{{ detail.orderId }}
          <img class="copyt d-img" src="@/assets/img/copyt.png" alt="" />
        </li>
      </ul>

      <div class="case-bets m-b-24">
        <div class="justify-between align-center b-b-d1 m-b-16 p-l-24 p-r-24">
          <p class="bets-title blod align-center">
            方案内容({{ getVisibility(detail.visibility) }})
          </p>
          <p
            class="no-buy center-center colorfff"
            v-if="+detail.status === 0 && isMe"
            @click="cancelAll"
          >
            撤销
          </p>
        </div>

        <template v-if="showContent(detail.visibility)">
          <ul
            class="p-l-24 p-r-24 m-b-16"
            v-for="(item, index) in detail.bets"
            :key="index"
          >
            <li class="align-center p-b-8">
              <span class="m-r-8 no-shrink">选号:</span
              ><span class="pink x-auto">
                <!-- {{
                  item?.b?.includes("|")
                  ? item?.b?.replace(/,/g, "").replace(/\|/g, " | ")
                  : item?.b?.replace(/\|/g, " | ")
                }} -->

                {{ item | modifyString }}
              </span>
            </li>
            <li class="align-center p-b-16">
              <span class="m-r-8">{{ item.p }}</span>
              <span class="m-r-8">{{ item.m }}倍</span>
              <span class="m-r-8">{{ item.c }}注</span>
              <span>{{ item.money }}元</span>
            </li>
          </ul>
        </template>
      </div>
      <div class="case-bets m-b-24">
        <p class="p-l-24 p-r-24 bets-title align-center justify-between b-b-d1">
          <span class="blod">当前开奖</span
          ><span class="more" @click="show = true">更多详情</span>
        </p>
        <div>
          <ul class="grad-3 text-center p-t-16 p-b-16 color999 b-b-d1">
            <li>期号</li>
            <li>开奖结果</li>
            <li>状态</li>
          </ul>
          <ul class="grad-3 text-center p-t-16 p-b-16">
            <li>{{ detail.expect }}</li>
            <li>{{ detail?.open?.openNum?.replace(/,/g, " ") || "--" }}</li>
            <li>
              {{
                detail.status == 2 ? "已撤销" : getOpenStatus(detail.openStatus)
              }}
            </li>
          </ul>
        </div>
      </div>
      <div class="case-bets m-b-24">
        <p class="p-l-24 p-r-24 bets-title align-center justify-between">
          <span class="blod">期号列表</span>
        </p>
        <div>
          <ul class="p-t-16 p-b-16 h-bg-gray grad-6 color999 text-center">
            <li>期号</li>
            <li>金额</li>
            <li>奖金</li>
            <li>开奖号码</li>
            <li>状态</li>
            <li>操作</li>
          </ul>
          <ul
            class="p-t-16 p-b-16 grad-6 text-center p-l-8 p-r-8"
            v-for="(item, index) in detail.expects"
            :key="index"
          >
            <li class="els">{{ item.expect }}</li>
            <li class="els">¥{{ divide(item.money) }}</li>
            <li class="els" :class="{ pink: +item.bingo > 0 }">
              ¥{{ divide(item.bingo) }}
            </li>
            <li class="els">
              {{ item?.open?.replace(/,/g, "|") || "-" }}
            </li>
            <li class="els">
              {{ btmStatus(item.status) }}
            </li>
            <li
              class="els pink underline"
              v-if="+item.status === 0 && isMe && detail.type3 == 1"
              @click="cancel(item.expect)"
            >
              撤销
            </li>
            <li class="els" v-else>--</li>
          </ul>
        </div>
      </div>
    </div>
    <van-popup class="pop-detail" v-model="show">
      <ul class="center-center pop-title colorfff">
        <li>详情</li>
        <li class="close font12" @click="show = false">关闭</li>
      </ul>
      <!-- 期号 方案编号 方案金额 中奖金额 发起人 发起时间 发起时间 购买方式 方案保底 追号 方案期数 -->
      <ul class="detail-pop-desc p-t-16 p-b-16">
        <li>
          <p>期号</p>
          <p>{{ detail.expect }}期</p>
        </li>
        <li>
          <p>方案编号</p>
          <p>{{ detail.orderId }}</p>
        </li>
        <li>
          <p>方案金额</p>
          <p>¥{{ divide(detail.money) }}</p>
        </li>
        <li>
          <p>中奖金额</p>
          <p :class="{ pink: +detail.moneyIncome > 0 }">
            ¥{{ divide(detail.moneyIncome) }}
          </p>
        </li>
        <li>
          <p>发起人</p>
          <p>{{ detail.playerName }}</p>
        </li>
        <li>
          <p>发起时间</p>
          <p>{{ $dayjsTime(detail.createdAt) }}</p>
        </li>
        <li>
          <p>截止下注</p>
          <p>{{ $dayjsTime(detail.finishTime) }}</p>
        </li>
        <li>
          <p>购买方式</p>
          <p>用户自购</p>
        </li>
        <li>
          <p>中奖停追号</p>
          <p>{{ detail.stopBingo ? "是" : "否" }}</p>
        </li>
        <li>
          <p>方案期数</p>
          <p>
            共 {{ detail.totalExpect }} 期 已完成 {{ detail.currExpect }} 期
          </p>
        </li>
      </ul>
    </van-popup>
    <tipsDialog ref="$tipsDialog" />
    <tipsDialog ref="$buyDialog" @sure="mySure" />
    <tipsDialog ref="$canAllDialog" @sure="ALLSure" />
    <tipsDialog ref="$canOneDialog" @sure="OneSure" />
  </div>
</template>

<script>
import userApi from "@/api/user";
import { mapGetters } from "vuex";
export default {
  name: "PurchaseRecordDetails",
  data() {
    return {
      show: false,
      id: +this.$route.query.id,
      detail: {},
      expect: "",
    };
  },
  filters: {
    modifyString: function (str) {
      console.log("BBB");
      // item?.b?.replace(/,/g, "").replace(/\|/g, " | ")
      // console.log("111", item?.b?.replace(/,/g, "").replace(/\|/g, " | "));
      let strE = str?.b;
      if (strE?.includes("|")) {
        return strE?.replace(/,/g, "").replace(/\|/g, " | ").replace(/ /g, "");
      } else {
        return strE?.replace(/,/g, "|").replace(/ /g, "");
      }
    },
  },
  computed: {
    ...mapGetters(["catList"]),
    lottery() {
      return this.detail?.lottery || {};
    },
    user() {
      return this.$store.state.user;
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
    theOne() {
      return this.$store.state.theOne;
    },
  },
  methods: {
    countPrice(item) {
      if (this.theOne.includes(item.name)) {
        return item.price;
      }
      return item.quantity * item.multiplier * item.price;
    },
    getOpenStatus(v) {
      const item = this.$store.state.openStatus.find((d) => d.id === v);
      return item ? item.name : "";
    },
    async cancelAll() {
      this.$refs.$canAllDialog.open("确定要撤销吗？");
    },
    async ALLSure() {
      const [err] = await userApi.lotteryMyOrderCancelRe({
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
      this.$toast.success("复制成功");
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
        return !this.detail.betCode ? this.isMe : true;
      }
      if (v === 3) {
        return this.isMe;
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
          name: "中奖不停",
          status: 0,
        },
        {
          name: "中奖停",
          status: 1,
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
      if (price === "all") {
        this.detail.clientMoney = this.detail.sellCount;
        this.$refs.$buyDialog.open(
          `全包金额: ${this.detail.clientMoney}元，确定全包?`
        );
        return;
      }
      if (!price) {
        this.$refs.$tipsDialog.open("请输入购买金额");
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
      const [err] = await userApi.lotteryBetsJoin({
        betId: this.detail.id,
        betCount: this.detail.clientMoney,
      });
      if (err) return;
      this.detail.clientMoney = "";
      this.$toast.success("购买成功");
      this.getDetail();
    },
    async getDetail() {
      const [err, res] = await userApi.betsOrderDetail({
        id: this.id,
      });
      if (err) return;
      res.data.clientMoney = "";
      res.data.sellCount = res.data.betTotal - res.data.betCountCurr / 100;
      res.data.betListArr = this.$util.parseFourStarInput(res.data.betCode);
      //res.data.clientMoney = res.data.sellCount;
      for (let key in res.data) {
        this.$set(this.detail, key, res.data[key]);
      }
    },
    async shareToChatRoom() {
      if (this.detail.status !== 0) {
        this.$toast("合买已结束，无法分享");
        return;
      }
      if (!this.shareData.chatAble) {
        this.$toast(`充值${this.shareData.recharge}才能解锁聊天`);
        return;
      }
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
      // this.$confirm("分享成功，是否查看聊天室消息?", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "success",
      //   customClass: "g-confirm-box",
      // })
      //   .then(() => {
      //     this.$router.push("/chat/room");
      //   })
      //   .catch(() => {});
    },
  },
  created() {
    this.getDetail();
  },
  beforeDestroy() {
    this.$store.commit("setCashDetail", this.detail);
  },
};
</script>
<style scoped lang="less">
.nav {
  height: 86px;
}

.list-cont {
  & > ul {
    border-bottom: 1px solid #e5e5e5;
  }

  & > ul > li {
    & > span:nth-child(1) {
      width: 118px;
    }
  }
}

.prize-cur {
  background: #fff;

  .headers {
    background: #fafbfb;
    border-bottom: 1px solid #e0e1e0;
  }
}

.open-prize {
  border: 1px solid #e0e1e0;

  & > li {
    min-height: 88px;
  }

  .prize-num {
    width: 48px;
    height: 48px;
    background: #bf2935;
    border-radius: 50%;
  }
}

.line {
  width: 1px;
  height: 24px;
  background: #333;
  margin: 0 8px;
}

.b-d-m {
  border-bottom: 1px dotted #e5e5e5;
}

.b-s-m {
  border-bottom: 1px solid #e5e5e5;
}

.user-title {
  height: 88px;
}

.user-desc {
  & > li {
    width: 25%;
    height: 78px;
  }
}

.p-btm {
  &,
  .fix-btm {
    height: 216px;
  }

  .fix-btm {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .b-money {
    background-color: #ffe7e9;
    height: 90px;
  }

  .btm-row {
    height: 126px;
    background: #2b2b2b;

    & > li {
      height: 126px;
    }
  }

  [type="text"] {
    width: 160px;
    height: 94px;
    background: #ffffff;
    border-radius: 14px 14px 14px 14px;
    border: none;
  }

  .btns {
    width: 180px;
    height: 126px;
    color: #ffffff;
  }

  .all {
    background: #484848;
  }

  .buy {
    background: #bf2935;
  }
}

.icoUrls {
  height: 48px;
  width: 48px;
}

.circle-box {
  padding: 24px 30px 24px 60px;
}

.circle-cont {
  background-color: #fff;
}

.circle-desc {
  & > p {
    span:nth-child(1) {
      color: #999;
      margin-bottom: 12px;
    }
  }
}

.form-uesrs {
  color: #343434;
  height: 74px;
  border-top: 1px solid #e5e5e5;
}

.case-bets {
  background-color: #fff;
}

.bets-title {
  height: 66px;
  //border-bottom: 1px solid #e0e1e0;
}

.pink {
  color: #bf2935;
}

.more {
  color: #f19838;
  text-decoration: underline;
}

.grad-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;

  & > li:nth-child(2) {
    text-align: right;
  }
}

.grad-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.grad-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  // & > li:nth-child(2) {
  //   text-align: right;
  // }
}

.grad-6 {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
}

.pop-detail {
  width: 652px;
  background: #ffffff;
  border-radius: 20px 20px 20px 20px;

  .pop-title {
    height: 76px;
    background: #bf2935;
    border-radius: 20px 20px 0px 0px;
    position: relative;

    .close {
      position: absolute;
      right: 24px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }
  }
}

.detail-pop-desc {
  & > li {
    height: 72px;
    align-items: center;
    display: flex;

    p:nth-child(1) {
      color: #999;
      width: 180px;
      padding-left: 32px;
    }
  }
}

.circle-playerName {
  max-width: 210px;
}

.copyt {
  width: 40px;
  height: 40px;
}

.no-buy {
  width: 82px;
  height: 44px;
  background: #bf2935;
  border-radius: 12px 12px 12px 12px;
}

.b-b-d1 {
  border-bottom: 1px solid #e0e1e0;
}

.h-bg-gray {
  background: #f0f0f0;
}
</style>
