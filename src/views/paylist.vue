<template>
  <div class="c-page bg-grey">
    <AppTopBar class="app-top-bar" topBarTitle="提现方式"> </AppTopBar>
    <div class="tx-box">
      <div class="item">
        可提现余额
        <div class="on">{{ divide(user.balance) }}元</div>
      </div>
    </div>
    <!-- 提现 已绑定 -->

    <div class="yh-box m-t-16">
      <div
        class="gh-box"
        v-for="bankCard in Cards"
        :key="bankCard.id"
        @click="gopay(+bankCard.ctype)"
      >
        <div class="left">
          <div class="yuan">
            <img
              class="d-img"
              :src="iconList.find((v) => v.ctype == bankCard.ctype)?.icon"
              alt=""
            />
          </div>
          <div class="info">
            <div class="i-1">{{ bankCard.bankName }}</div>
            <div class="i-2">
              **** **** ****{{ bankCard.cardNumber.slice(-4) }}
            </div>
          </div>
        </div>
        <div class="right">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
    <!-- 提现 未绑定 -->
    <template>
      <div class="bd-box">
        <div
          class="lists"
          v-if="!bankCard.id && typeList.includes(2)"
          @click="$router.push('/edtMyCard')"
        >
          <div class="left">
            <van-icon name="plus" class="plus-icon" />
            <div class="name">绑定银行卡</div>
          </div>
          <div class="right">
            <van-icon name="arrow" class="arrow-icon" />
          </div>
        </div>
        <div
          class="lists"
          v-if="!usdtCard.id && typeList.includes(3)"
          @click="$router.push('/bindUsdt')"
        >
          <div class="left">
            <van-icon name="plus" class="plus-icon" />
            <div class="name">绑定USDT</div>
          </div>
          <div class="right">
            <van-icon name="arrow" class="arrow-icon" />
          </div>
        </div>
        <div
          class="lists"
          v-if="!wechatCard.id && typeList.includes(1)"
          @click="$router.push('/bindWebchat')"
        >
          <div class="left">
            <van-icon name="plus" class="plus-icon" />
            <div class="name">绑定微信</div>
          </div>
          <div class="right">
            <van-icon name="arrow" class="arrow-icon" />
          </div>
        </div>
        <div
          class="lists"
          v-if="!alipayCard.id && typeList.includes(0)"
          @click="$router.push('/bindAlipay')"
        >
          <div class="left">
            <van-icon name="plus" class="plus-icon" />
            <div class="name">绑定支付宝</div>
          </div>
          <div class="right">
            <van-icon name="arrow" class="arrow-icon" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import userApi from "@/api/user";
const initForm = () => {
  return {
    ctype: 2,
    cardName: "",
    identity: "",
    cardNumber: "",
    bankName: "",
    subBranch: "",
  };
};
export default {
  name: "AppWithdrawal",
  data() {
    return {
      form: initForm(),
      //0支付宝 1微信 2银行卡 3USDT
      iconList: [
        {
          icon: require("@/assets/img/bank/ctype0.png"),
          name: "支付宝",
          ctype: 0,
        },
        {
          icon: require("@/assets/img/bank/ctype1.png"),
          name: "微信",
          ctype: 1,
        },
        {
          icon: require("@/assets/img/Recharge/yinhang.png"),
          name: "银行卡",
          ctype: 2,
        },
        {
          icon: require("@/assets/img/Recharge/usdt.png"),
          name: "USDT地址",
          ctype: 3,
        },
      ],
    };
  },
  computed: {
    statusCheck() {
      return [
        { name: `您的${this.bankTxt}还在审核中,请审核通过再提现`, id: 0 },
        { name: `审核通过`, id: 1 },
        { name: `您的${this.bankTxt}审核不通过,无法提现`, id: 2 },
      ];
    },
    bankTxt() {
      //0支付宝 1微信 2银行卡 3USDT
      const arr = ["支付宝", "微信", "银行卡", "USDT地址"];
      //return this.ctype === 2 ? "银行卡" : "USDT地址";
      return arr[this.form.ctype];
    },
    user() {
      return this.$store.state.user;
    },
    typeList() {
      return this.$store.state.bankCard.map((v) => v.ctype);
    },
    Cards() {
      return this.$store.state.bankCard.filter((v) => v.createdAt);
    },
    bankCard() {
      const doc = this.Cards.find((v) => +v.ctype === 2) || {};
      return doc;
    },
    usdtCard() {
      return this.Cards.find((v) => +v.ctype === 3) || {};
    },
    //支付宝
    alipayCard() {
      return this.Cards.find((v) => +v.ctype === 0) || {};
    },
    //微信
    wechatCard() {
      return this.Cards.find((v) => +v.ctype === 1) || {};
    },
  },
  methods: {
    //0支付宝 1微信 2银行卡 3USDT
    gopay(ctype) {
      if (ctype === 0) {
        this.$router.push("/bindAlipay");
      } else if (ctype === 1) {
        this.$router.push("/bindWebchat");
      } else if (ctype === 2) {
        this.$router.push("/edtMyCard");
      } else if (ctype === 3) {
        this.$router.push("/bindUsdt");
      }
    },
    resData(obj) {
      this.form = {
        ...initForm(),
        ...obj,
        usdtId: obj.id,
        type: obj.ctype,
        money: "",
        payPwd: "",
      };
    },
    async ajaxBindCard() {
      if (+this.form.statusCheck !== 1) {
        const msg =
          this.statusCheck.find((v) => +v.id === +this.form.statusCheck) || {};
        this.$toast(msg.name);
        return;
      }
      //金额必须正整数
      if (!/^[1-9]\d*$/.test(this.form.money)) {
        this.$toast.fail("提现金额必须为正整数");
        return;
      }
      //支付密码必须为6位数字
      if (!/^\d{6}$/.test(this.form.payPwd)) {
        this.$toast.fail("支付密码必须是6位数字");
        return;
      }
      this.$toast.loading({ duration: 0 });
      const [err] = await userApi.withdrawalReq({
        ...this.form,
      });
      if (err) return;
      this.$toast.clear();
      this.$store.dispatch("getBankCard");
      this.$toast.success("提现成功.等待管理员审核");
      this.$router.back();
    },
  },
  async created() {
    this.$store.dispatch("getInfo");
    this.$toast.loading({ duration: 0 });
    await this.$store.dispatch("getBankCard");
    this.$toast.clear();
    this.resData(this.Cards[0]);
    // if (this.bankCard.id) {
    //   this.resData(this.bankCard);
    // } else if (this.usdtCard.id) {
    //   this.resData(this.usdtCard);
    // }
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
.ye-box {
  padding: 30px 28px;
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  .on {
    margin-left: 20px;
    color: #bf2935;
  }
}
.bd-box {
  margin-top: 20px;
  background: #fff;
  .lists {
    border-bottom: 1px solid #f9f9f9;
    padding: 28px 22px;
    display: flex;
    align-items: center;
    &:last-child {
      border-bottom: none;
    }
    .left {
      flex: 1;
      display: flex;
      align-items: center;
      color: #666666;
      .plus-icon {
        margin-right: 8px;
        font-size: 40px;
        color: #666666;
      }
    }
    .right {
      .arrow-icon {
        font-size: 40px;
        color: #ccc;
      }
    }
  }
}
.yh-box {
  background: #fff;
  .khm-box {
    padding: 28px 28px;
    border-bottom: 1px solid #e5e5e5;
  }
  .gh-box {
    padding: 24px 28px;
    display: flex;
    align-items: center;
    .left {
      flex: 1;
      display: flex;
      align-items: center;
      .yuan {
        width: 80px;
        height: 80px;
        border-radius: 100%;
      }
      .info {
        margin-left: 16px;
        .i-2 {
          font-size: 24px;
          color: #999999;
        }
      }
    }
    .right {
      .arrow-icon {
        font-size: 36px;
        color: #ccc;
      }
    }
  }
}
.tx-box {
  margin-top: 20px;
  background: #fff;
  .item {
    padding: 30px 28px;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    &:last-child {
      border-bottom: none;
    }
    .on {
      color: #bf2935;
      margin-left: 20px;
    }
    .input {
      margin-left: 20px;
      border: none;
      outline: none;
    }
  }
}
.btn-box {
  width: 694px;
  height: 88px;
  background: #bf2935;
  border-radius: 126px 126px 126px 126px;
  color: #fff;
  font-size: 32px;
  margin: 0 auto;
  margin-top: 56px;
}
.ts-box {
  padding: 32px 28px;
  margin-top: 40px;
  .content-box {
    background: #f3f3f3;
    border-radius: 10px 10px 10px 10px;
    padding: 16px 28px;
    font-size: 22px;
    color: #999999;
    .tips {
      display: flex;
      color: #c82834;
      align-items: center;
      margin-bottom: 12px;
      .tips-icon {
        margin-right: 12px;
        color: #c82834;
        font-size: 36px;
      }
    }
    .li {
      margin-top: 2px;
    }
  }
}
.check-icon {
  color: #bf2935 !important;
}
</style>
