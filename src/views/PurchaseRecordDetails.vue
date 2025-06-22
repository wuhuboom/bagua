<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="订单详情">
      <template v-slot:right>
        <p
          class="colorfff m-r-16"
          v-if="shareData.chatAble !== undefined"
          @click="shareToChatRoom"
        >
          分享到聊天室
        </p>
      </template>
    </AppTopBar>
    <ul
      class="nav active font16 bg-fff m-b-24 align-center justify-between p-l-24 p-r-24"
    >
      <li>{{ getName(detail.lotteryId) }}</li>
      <li
        class="underline"
        v-if="+detail.status === 0 && isMe"
        @click="cancelAll"
      >
        撤销
      </li>
      <li v-else>{{ getStatus(detail.status) }}</li>
    </ul>
    <div class="bg-fff font14 list-cont">
      <ul class="nav align-center justify-between p-l-24 p-r-24">
        <li class="align-center els">
          <span class="color999">方案编号</span>
          <span class="els m-l-24 color333" @click="copy(detail.orderId)">{{
            detail.orderId
          }}</span>
        </li>
        <li class="active font16 m-l-24 no-shrink">
          {{ getOpenStatus(detail.openStatus) }}
        </li>
      </ul>
      <ul class="nav align-center justify-between p-l-24 p-r-24">
        <li class="align-center els">
          <span class="color999">订单金额</span>
          <span class="els m-l-24 color333">¥{{ divide(detail.money) }}</span>
        </li>
      </ul>
      <ul class="nav align-center justify-between p-l-24 p-r-24">
        <li class="align-center els">
          <span class="color999">订单期数</span>
          <span class="els m-l-24 color333">{{ detail.totalExpect }}</span>
        </li>
      </ul>
      <ul class="nav align-center justify-between p-l-24 p-r-24">
        <li class="align-center els">
          <span class="color999">完成期数</span>
          <span class="els m-l-24 color333">{{ detail.currExpect }}</span>
        </li>
      </ul>
      <ul class="nav align-center justify-between p-l-24 p-r-24">
        <li class="align-center els">
          <span class="color999">追号</span>
          <span class="els m-l-24 color333">{{
            getReType(+detail.reType)
          }}</span>
        </li>
      </ul>
      <ul class="nav align-center justify-between p-l-24 p-r-24">
        <li class="align-center els">
          <span class="color999">保底</span>
          <span class="els m-l-24 color333"
            >{{ getBtype(detail.btype) }}
            {{ detail.ftype === 1 ? `| 系统满单` : "" }}</span
          >
        </li>
      </ul>
      <ul class="nav align-center justify-between p-l-24 p-r-24">
        <li class="align-center els">
          <span class="color999">购买方式</span>
          <span class="els m-l-24 color333">用户合买</span>
        </li>
      </ul>
      <ul class="nav align-center justify-between p-l-24 p-r-24">
        <li class="align-center els">
          <span class="color999">剩余金额</span>
          <span class="els m-l-24 color333">¥{{ detail.sellCount }}</span>
        </li>
      </ul>
      <ul class="nav align-center justify-between p-l-24 p-r-24">
        <li class="align-center els">
          <span class="color999">中奖金额</span>
          <span class="els m-l-24 color333"
            >¥{{ divide(detail.moneyIncome) }}</span
          >
        </li>
      </ul>
      <ul class="nav align-center justify-between p-l-24 p-r-24">
        <li class="align-center els">
          <span class="color999">订单状态</span>
          <span class="els m-l-24 color333">{{
            getStatus(detail.status)
          }}</span>
        </li>
      </ul>
    </div>
    <div class="prize-cur p-x-24 font16 m-t-24">
      <ul class="open-prize">
        <li class="center-center headers">当前开奖号码</li>
        <li class="justify-around align-center">
          <p>
            第
            <span class="active">{{ detail?.open?.cycleNum }}</span>
            期
          </p>
          <div class="center-center">
            <p
              class="prize-num center-center color-fff"
              v-for="(num, idx) in getOpen(detail?.open?.openNum)"
              :key="idx"
            >
              {{ num }}
            </p>
          </div>
        </li>
      </ul>
    </div>
    <div class="prize-cur p-x-24 font16 m-t-24">
      <ul class="open-prize">
        <li class="center-center headers">
          投注内容({{ getVisibility(detail.visibility) }})
        </li>
        <li>
          <div v-if="showContent(detail.visibility)">
            <ul
              class="align-center justify-between m-l-24 m-r-24 p-b-24"
              v-for="(item, index) in detail.bets"
              :key="index"
              :class="{ 'p-t-24 b-d-m m-b-24': index == 0 }"
            >
              <!-- "c": 2,//注数 "m": 2,//倍数 "b": "22,11",//号码
              "p":"三星和值"//玩法 -->
              <li class="font12 no-shrink m-r-8">
                <span>{{ item.p }}</span>
                <p class="m-t-8 space-between">
                  <span class="m-r-16 center-center"
                    >共
                    <i class="m-l-8 m-r-8">{{ item.c }}</i>
                    注</span
                  >
                  <span class="m-r-16">{{ item.m }}倍</span>
                  <span class="active">{{ item.money }}元</span>
                </p>
              </li>
              <li class="x-auto">
                <div class="align-center">
                  <div
                    class="align-center"
                    v-for="(doc, idx) in $util.betsCode(item?.b)"
                    :key="idx"
                  >
                    <p
                      class="prize-num center-center color-fff"
                      v-for="(v, i) in doc"
                      :key="i"
                      :class="{ font11: isNaN(+v) }"
                    >
                      {{ v }}
                    </p>
                    <p
                      class="center-center line"
                      v-if="idx < $util.betsCode(item?.b).length - 1"
                    ></p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div
      class="user-jions bg-fff px-24 m-t-24 font14"
      v-if="detail.joins?.length"
    >
      <p class="p-l-24 p-r-24 user-title align-center font16">用户列表</p>
      <ul class="user-desc bg-grey align-center p-l-8 p-r-8">
        <li class="center-center">昵称</li>
        <li class="center-center">认购金额</li>
        <li class="center-center">奖金</li>
        <li class="center-center">所占比例</li>
      </ul>
      <ul
        class="user-desc align-center color777 p-l-8 p-r-8"
        v-for="(item, index) in detail.joins"
        :key="index"
        :class="{ 'b-d-m': index !== detail.joins.length - 1 }"
      >
        <li class="center-center els">
          <p class="els">{{ item.playerName }}</p>
        </li>
        <li class="center-center els">
          <p class="els">¥{{ divide(item.money) }}</p>
        </li>
        <li class="center-center els">
          <p class="els">¥{{ divide(item.moneyIncome) }}</p>
        </li>
        <li class="center-center els">
          <p class="els">{{ $util.toPercent(item.money, detail.money, 4) }}</p>
        </li>
      </ul>
    </div>
    <div class="user-jions bg-fff px-24 m-t-24 font14">
      <p class="p-l-24 p-r-24 user-title align-center font16">期号列表</p>
      <ul class="user-desc bg-grey align-center p-l-8 p-r-8">
        <li class="center-center">期号</li>
        <li class="center-center">金额</li>
        <li class="center-center">奖金</li>
        <li class="center-center">开奖号码</li>
        <li class="center-center">状态</li>
        <li class="center-center">操作</li>
      </ul>
      <ul
        class="user-desc align-center color777 p-l-8 p-r-8"
        v-for="(item, index) in detail.expects"
        :key="index"
        :class="{ 'b-d-m': index !== detail.expects?.length - 1 }"
      >
        <li class="center-center els">
          <p class="els">{{ item.expect }}</p>
        </li>
        <li class="center-center els">
          <p class="els">¥{{ divide(item.money) }}</p>
        </li>
        <li class="center-center els">
          <p class="els">¥{{ divide(item.bingo) }}</p>
        </li>
        <li class="center-center els">
          <p class="els">{{ item.open }}</p>
        </li>
        <li class="center-center els">
          <p class="els">{{ btmStatus(item.status) }}</p>
        </li>
        <li class="center-center els">
          <p
            class="active underline"
            v-if="+item.status === 0 && isMe && detail.type3 == 1"
            @click="cancel(item.expect)"
          >
            撤销
          </p>
          <p v-else>--</p>
        </li>
      </ul>
    </div>
    <div class="p-btm" v-if="detail.sellCount && +detail.status === 0">
      <div class="fix-btm">
        <p class="center-center b-money font16 active">
          剩余: {{ detail.sellCount }}元
        </p>
        <ul class="btm-row p-l-24 align-center font16">
          <li class="align-center flex-1">
            <span class="color-fff">购买</span>
            <input
              class="p-x-24 m-l-28 m-r-28"
              type="text"
              @input="validateInput(detail, $event)"
              v-model.trim="detail.clientMoney"
            />
            <span class="color-fff">元</span>
          </li>
          <li class="center-center btns all" @click="buyPlayer('all')">全包</li>
          <li
            class="center-center btns buy"
            @click="buyPlayer(detail.clientMoney)"
          >
            购买
          </li>
        </ul>
      </div>
    </div>
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
      id: +this.$route.query.id,
      detail: {},
      expect: "",
      shareData: {
        // chatAble
        // recharge 3000
      },
    };
  },
  computed: {
    ...mapGetters(["catList"]),
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
  },
  methods: {
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
      res.data.betCountCurr = res.data.betCountCurr / 100;
      res.data.betTotal = res.data.betTotal / 100;
      res.data.sellCount = res.data.betTotal - res.data.betCountCurr;
      res.data.betListArr = res.data.betCode
        ? this.$util.parseFourStarInput(res.data.betCode)
        : [];
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
    this.chat();
    this.getDetail();
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
</style>
