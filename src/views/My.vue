<template>
  <div class="c-page bg-grey">
    <AppTopBar class="app-top-bar" topBarTitle="我的" :showLeft="false">
      <template v-slot:right>
        <div class="right-box">
          <van-icon name="setting-o" @click="$tool.goPage('/set-up')" />
        </div>
      </template>
    </AppTopBar>
    <div class="tx-box">
      <div class="t-1" @click="$tool.goPage('/user-center')">
        <div class="left">
          <div class="img-box">
            <img
              :src="
                user.headerImg ? `${$baseURL}/${user.headerImg}` : DefaultAvatar
              "
              class="img"
            />
          </div>
          <div class="info">
            <div class="name">
              <div class="lin text-ellipsis">{{ user.username }}</div>
              <div class="hy-icon"></div>
            </div>
            <div class="text">ID: {{ user.idNo }}</div>
          </div>
        </div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div class="t-2">
        <div class="item">
          <div class="num">{{ divide(user.balance) }}</div>
          <div class="text">可用余额(元)</div>
        </div>
        <div class="item">
          <div class="num">{{ divide(user.taskAim) }}</div>
          <div class="text">投注任务(元)</div>
        </div>
        <div class="item">
          <div class="num">{{ dieMoney }}</div>
          <div class="text">冻结(元)</div>
        </div>
      </div>
    </div>
    <ul class="fct-box p-x-32 justify-between colorfff">
      <li class="center-center" @click="recharge">充值</li>
      <li class="center-center" @click="withdraw">提现</li>
      <li class="center-center" @click="$tool.goPage('/invite-friends')">
        <img class="d-img m-r-8" src="@/assets/img/mrf.png" alt="" />
        邀请好友
      </li>
    </ul>
    <div class="p-l-32 p-r-32 p-b-32">
      <ul class="menus-list p-t-32 flex-wrap">
        <li
          class="center-center p-b-32"
          v-for="(item, index) in navs"
          :key="index"
          @click="goPgae(item.path)"
        >
          <div class="flex-column center-center">
            <p class="m-b-8">
              <img class="d-img" :src="item.icon" alt="" />
            </p>
            <p>{{ item.name }}</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- <div class="lists-box">
      <div
        class="item"
        @click="
          $router.push({
            path: '/chat',
          })
        "
      >
        <div class="left">
          <div class="l-icon i-13"></div>
          <div class="name">聊天室</div>
        </div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div
        class="item"
        @click="
          $router.push({
            path: '/BalanceVault',
            query: { id: 1, title: '余额宝' },
          })
        "
      >
        <div class="left">
          <div class="l-icon i-10"></div>
          <div class="name">余额宝</div>
        </div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div
        class="item"
        @click="
          $router.push({
            path: '/myBallRecord',
          })
        "
      >
        <div class="left">
          <div class="l-icon i-1"></div>
          <div class="name">购票记录</div>
        </div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div class="item" @click="$tool.goPage('/financial-details')">
        <div class="left">
          <div class="l-icon i-2"></div>
          <div class="name">资金明细</div>
        </div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div class="item" @click="$tool.goPage('/FundDetail')">
        <div class="left">
          <div class="l-icon i-11"></div>
          <div class="name">红包记录</div>
        </div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div class="item" @click="$tool.goPage('/GiftRecord')">
        <div class="left">
          <div class="l-icon i-12"></div>
          <div class="name">赠送记录</div>
        </div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div class="item" @click="$tool.goPage('/my-discount')">
        <div class="left">
          <div class="l-icon i-3"></div>
          <div class="name">优惠活动</div>
        </div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div class="item" @click="$tool.goPage('/promotion-commission')">
        <div class="left">
          <div class="l-icon i-4"></div>
          <div class="name">我的团队</div>
        </div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div class="item" @click="$tool.goPage('/downloadApp')">
        <div class="left">
          <div class="l-icon i-14"></div>
          <div class="name">下载APP</div>
        </div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div class="item" @click="$tool.goPage('/invite-friends')">
        <div class="left">
          <div class="l-icon i-5"></div>
          <div class="name">邀请好友</div>
        </div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div class="item" @click="$store.dispatch('getServeData', 1)">
        <div class="left">
          <div class="l-icon i-6"></div>
          <div class="name">在线客服</div>
        </div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
    </div> -->
    <tipsDialog ref="$bankDialog" @sure="goBank" />
    <AppBtmBar></AppBtmBar>
	<Customer ref="$customerDialog" />
  </div>
</template>

<script>
import userApi from "@/api/user";
import DefaultAvatar from "@/assets/img/DefaultAvatar.jpg";
import Customer from "@/components/customer";
export default {
  name: "AppMy",
  data() {
    return {
      DefaultAvatar,

      navs: [
        {
          path: "/myBallRecord",
          icon: require("@/assets/img/tets.png"),
          name: "购票记录",
        },
        {
          path: "/financial-details",
          icon: require("@/assets/img/tets1.png"),
          name: "资金明细",
        },
        {
          path: "/FundDetail",
          icon: require("@/assets/img/My/rediocn.png"),
          name: "红包记录",
        },
        {
          path: "/GiftRecord",
          icon: require("@/assets/img/My/gift.png"),
          name: "赠送记录",
        },
        {
          path: "/promotion-commission",
          icon: require("@/assets/img/My/m5.png"),
          name: "我的团队",
        },
        {
          path: "/downloadApp",
          icon: require("@/assets/img/downapp.png"),
          name: "下载APP",
        },
        {
          path: "getServeData",
          icon: require("@/assets/img/My/m4.png"),
          name: "在线客服",
        },
        {
          path: "/BalanceVault",
          icon: require("@/assets/img/My/m10.png"),
          name: "余额宝",
        },
        {
          path: "/chat",
          icon: require("@/assets/img/My/room.png"),
          name: "聊天室",
        },
      ],
    };
  },
  components: {
	Customer
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    dieMoney() {
      //frozenBet 投注  frozenWithdrawa 提现冻结
      return this.divide(this.user.frozenBet + this.user.frozenWithdrawal);
    },
    paySet() {
      return this.$store.state.paySet;
    },
    Cards() {
      return this.$store.state.bankCard;
    },
    bankCard() {
      return this.Cards.find((v) => +v.ctype === 2) || {};
    },
    usdtCard() {
      return this.Cards.find((v) => +v.ctype === 3) || {};
    },
  },
  methods: {
	openCustomerDialog() {
	  this.$refs.$customerDialog.open();
	},
    goPgae(path) {
      if (path === "getServeData") {
		return this.openCustomerDialog()
        // return this.$store.dispatch("getServeData", 1);
      }
      this.$router.push(path);
    },
    openTipsDialog() {
      this.$refs.$bankDialog.open(
        "您好，您还未绑定提款银行卡，确定现在进行绑定银行卡？"
      );
    },
    goBank() {
      this.$router.push("/bindCard");
    },
    async recharge() {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      const [err, res] = await userApi.recharge();
      if (err) return;
      this.$toast.clear();
      res.data = res.data?.filter((item) => item?.list?.length);
      if (!res.data || !res.data.length) {
        this.$dialog
          .confirm({
            message: "请联系人工客服",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            className: "confirm-no-tile-dialog",
          })
          .then(() => {
			this.openCustomerDialog()
            // this.$store.dispatch("getServeData", 1);
          })
          .catch(() => {
            // on cancel
          });
        return;
      }
      this.$router.push("/recharge");
    },
    comfire2() {
      return new Promise((resolve) => {
        this.$dialog
          .confirm({
            message: "请联系人工客服",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
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
    comfire(v = "请联系在线客服", bt = "确定") {
      return new Promise((resolve) => {
        this.$dialog
          .alert({
            message: v,
            className: "online-serve-dialog",
            theme: "round-button",
            closeOnClickOverlay: true, // 允许点击背景关闭
            confirmButtonText: bt,
          })
          .then(() => {
            resolve(1);
          })
          .catch(() => {
            resolve(0);
          });
      });
    },
    comfire3(v) {
      return new Promise((resolve) => {
        this.$dialog
          .confirm({
            message: v,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
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
    async withdraw() {
      if (!this.Cards.length) {
        const status = await this.comfire3(
          "您好，您还未绑定提款方式，确定现在进行绑定？"
        );
        if (!status) return;
        this.$router.push("/paylist");
        return;
      }
      if (this.paySet !== 1) {
        this.$toast.fail("请先设置支付密码");
        return this.$router.push("/payPassword");
      }
      ///withdrawal
      this.$router.push("/withdrawal");
    },
  },
  async created() {
    this.$toast.loading({
      duration: 0,
      forbidClick: true,
    });
    await Promise.all([
      this.$store.dispatch("getPaySet"),
      this.$store.dispatch("getBankCard"),
    ]);
    this.$toast.clear();
    await this.$store.dispatch("getInfo");
    await this.$store.dispatch("getCustomer");
  },
};
</script>
<style scoped lang="less">
.app-top-bar {
  .right-box {
    color: #fff;
    margin-right: 40px;
    font-size: 40px;
  }
}

.tx-box {
  background: #fff;

  .t-1 {
    display: flex;
    padding: 40px 28px 30px;
    align-items: center;

    .left {
      flex: 1;
      display: flex;
      align-items: center;

      .img {
        width: 96px;
        height: 96px;
        border-radius: 100%;
        display: block;
      }

      .info {
        margin-left: 24px;

        .name {
          font-size: 32px;
          display: flex;
          align-items: center;

          .lin {
            max-width: 300px;
          }

          .hy-icon {
            width: 32px;
            height: 32px;
            margin-left: 14px;
            background: url("@/assets/img/My/m7.png") no-repeat;
            background-size: 100% auto;
          }
        }

        .text {
          color: #666666;
        }
      }
    }

    .right {
      .arrow-icon {
        color: #ccc;
        font-size: 36px;
      }
    }
  }

  .t-2 {
    display: flex;
    border-top: 1px solid #e5e5e5;

    .item {
      padding: 26px 0;
      position: relative;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      &::after {
        content: "";
        position: absolute;
        right: 0;
        width: 1px;
        height: 60px;
        background: #e5e5e5;
        top: 50%;
        margin-top: -30px;
      }

      &:last-child::after {
        display: none;
      }

      .num {
        font-size: 36px;
      }

      .text {
        color: #999999;
        font-size: 20px;
        margin-top: 6px;
      }
    }
  }
}

.cz-box {
  margin-top: 20px;
  display: flex;
  background: #fff;

  .item {
    flex: 1;
    height: 96px;
    font-size: 32px;
    color: #333333;
    font-weight: bold;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      right: 0;
      width: 1px;
      height: 60px;
      background: #e5e5e5;
      top: 50%;
      margin-top: -30px;
    }

    &:last-child::after {
      display: none;
    }

    .name {
      position: relative;

      .num {
        position: absolute;
        right: -20px;
        top: -10px;
        background: #f33e45;
        color: #fff;
        font-size: 20px;
        border-radius: 20px;
        padding: 0 8px;
        min-width: 30px;
        height: 30px;
        font-weight: 400;
      }
    }
  }
}

.lists-box {
  padding-left: 28px;
  background: #fff;
  margin-top: 20px;

  .item {
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    padding: 24px 0;
    padding-right: 20px;

    &:last-child {
      border-bottom: none;
    }

    .left {
      flex: 1;
      display: flex;
      align-items: center;

      .l-icon {
        background-repeat: no-repeat;
        background-size: 100% auto;
        width: 48px;
        height: 48px;
        margin-right: 14px;

        &.i-1 {
          background-image: url("@/assets/img/My/m3.png");
        }

        &.i-2 {
          background-image: url("@/assets/img/My/m2.png");
        }

        &.i-3 {
          background-image: url("@/assets/img/My/m1.png");
        }

        &.i-4 {
          background-image: url("@/assets/img/My/m5.png");
        }

        &.i-5 {
          background-image: url("@/assets/img/My/m6.png");
        }

        &.i-6 {
          background-image: url("@/assets/img/My/m4.png");
        }

        &.i-8 {
          background-image: url("@/assets/img/My/m8.png");
        }

        &.i-9 {
          background-image: url("@/assets/img/My/m9.png");
        }

        &.i-10 {
          background-image: url("@/assets/img/My/m10.png");
        }

        &.i-11 {
          background-image: url("@/assets/img/My/rediocn.png");
        }

        &.i-12 {
          background-image: url("@/assets/img/My/gift.png");
        }

        &.i-13 {
          background-image: url("@/assets/img/My/room.png");
        }

        &.i-14 {
          background-image: url("@/assets/img/downapp.png");
        }
      }
    }

    .right {
      .arrow-icon {
        color: #ccc;
        font-size: 36px;
      }
    }
  }
}

.fct-box {
  & > li {
    width: 212px;
    height: 68px;
    background: linear-gradient(274deg, #ca404b 0%, #bf2935 100%);
    box-shadow: 0px 6px 12px 2px rgba(0, 0, 0, 0.16);
    border-radius: 12px 12px 12px 12px;
  }

  & > li:last-child {
    background: #b78756;

    img {
      width: 35px;
      height: 35px;
    }
  }
}

.menus-list {
  background-color: #fff;

  & > li {
    width: 25%;

    img {
      width: 56px;
      height: 56px;
    }
  }
}
</style>
