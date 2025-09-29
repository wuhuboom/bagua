<template>
  <div class="index-page c-page bg-grey">
    <AppTopBar
      ref="topBar"
      :topBarTitle="$store.state.logoTxt"
      :showLeft="false"
    >
    </AppTopBar>
    <div class="top-header p-t-16 p-b-32">
      <van-swipe class="swipe-box" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(p, i) in slider" :key="i">
          <p
            @click="goDetail(p)"
            class="item"
            :style="{ backgroundImage: `url(${p.imageUrl})` }"
          ></p>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="p-l-24 p-r-24 font12">
      <NoticeBar
        class="notice-bar"
        background="#fff"
        color="#333333"
        :left-icon="labaImg"
        @click="$router.push('/notice')"
      >
        {{ noticeDoc.content }}
        <template #right-icon>
          <img src="@/assets/img/more.png" style="width: 20px; height: 20px" />
        </template>
      </NoticeBar>
    </div>
    <div
      class="nav-wrap font12 m-l-24 m-r-24 m-b-12 p-x-24 justify-between align-center"
    >
      <ul @click="$store.dispatch('getInfo')">
        <li class="m-b-8">{{ user.username }}</li>
        <li class="align-center">
          ￥
          <template v-if="show">
            <div class="m-r-16 align-center">
              <p class="balance">{{ divide(user.balance) }}</p>
              <van-icon
                name="replay"
                class="m-l-4"
                style="font-weight: bold"
                color="#E50012"
              />
            </div>
          </template>
          <template v-else> ****** </template>
          <i
            class="icon iconfont font18 my-show"
            @click.stop="show = !show"
            :class="[
              show ? 'icon-yanjing_xianshi_o' : 'icon-yanjing_yincang_o',
            ]"
          ></i>
        </li>
      </ul>
      <ul class="my-nav flex-wrap">
        <li class="flex-column center-center m-r-32" @click="recharge">
          <img class="d-img m-b-8" src="@/assets/img/icon-idx2.png" alt="" />
          <p>充值</p>
        </li>
        <li class="flex-column center-center" @click="withdraw">
          <template v-if="loaded"
            ><img class="d-img m-b-8" src="@/assets/img/icon-idx1.png" alt="" />
            <p>提现</p>
          </template>
          <template v-else>
            <van-loading color="#1989fa" />
          </template>
        </li>
      </ul>
    </div>
    <div class="p-l-24 p-r-24 m-b-24 ottery-bts">
      <van-tabs v-model="active">
        <van-tab :title="p.lotteryName" v-for="(p, i) in cat" :key="i">
          <ul class="nav-ottery-bt flex-wrap font12">
            <li
              class="flex-column center-center"
              v-for="(item, idx) in p.list"
              :key="idx"
              @click="
                $router.push({
                  path: `/game/hall`,
                  query: {
                    id: item.id,
                    type: item.lotteryType,
                  },
                })
              "
            >
              <p class="m-b-12">
                <img
                  class="d-img icons"
                  :src="`${item.icoUrls || nav5Icon}`"
                  alt=""
                />
              </p>
              <p>{{ item.lotteryNameH5 }}</p>
            </li>
          </ul>
        </van-tab>
      </van-tabs>
    </div>
    <div class="m-l-24 m-r-24 prize-boxs">
      <p class="p-b-32 p-t-32">
        <img class="d-img" src="@/assets/img/prize-line.png" alt="" />
      </p>
      <div class="prize-bg">
        <ul class="grid-table p-x-16">
          <li>玩家</li>
          <li>游戏</li>
          <li>中奖金额</li>
        </ul>
        <div class="grid-auto">
          <div class="scroll-list">
            <ul
              class="grid-table prize-li p-x-16 font12"
              v-for="(v, i) in wins"
              :key="i"
            >
              <li>{{ v.playerName }}</li>
              <li>{{ random() }}</li>
              <li>{{ divide(v.money) }}</li>
            </ul>
            <ul
              class="grid-table prize-li p-x-16 font12"
              v-for="(v, i) in wins"
              :key="'w' + i"
            >
              <li>{{ v.playerName }}</li>
              <li>{{ random() }}</li>
              <li>{{ divide(v.money) }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 活动弹窗 -->
    <div class="activity-pop" v-if="0">
      <div class="bg"></div>
      <div class="pop-wrap">
        <div class="title">新用户首充专享</div>
        <div class="item-box">
          <div class="item" v-for="i in 4" :key="i">
            <div class="left center-center">
              <div class="t1">￥</div>
              <div class="t2">2</div>
            </div>
            <div class="right text-ellipsis">
              <div class="t1 text-ellipsis">新人免费彩金</div>
              <div class="t2 text-ellipsis">有效期7天</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 发现新版本 -->
    <div class="version-box" v-if="fromModal2">
      <div class="bg"></div>
      <div class="version-wrap">
        <div class="top-icon"></div>
        <!-- 立即更新 -->
        <div class="wrap-box" v-if="!progressBarState">
          <div class="text">发现新版本</div>
          <div class="btn center-center" @click="simulateProgressBar">
            立即更新
          </div>
        </div>
        <!-- 更新中 -->
        <div class="wrap-box" v-else>
          <div class="text">
            更新中 <span class="num">{{ this.progressBar }}%</span>
          </div>
          <div class="dex center-center">正在更新中,请勿关闭当前页面…</div>
        </div>
      </div>
    </div>
    <img
      class="d-img serve"
      src="@/assets/img/serve.png"
      alt=""
      @click="$store.dispatch('getServeData', 1)"
    />

    <!-- 设置支付密码 -->
    <van-dialog
      v-model="showPwdForm"
      :show-confirm-button="false"
      title="请设置支付密码"
      :lazy-render="false"
    >
      <van-form @submit="confirm">
        <van-field
          v-model="pwdForm.payPwd"
          :label-width="70"
          type="password"
          label="支付密码"
          placeholder="请输入六位数字"
          :rules="[
            { required: true, message: $t('backapi.passwordIsEmpty') },
            {
              pattern: /^\d{6}$/,
              message: '支付密码必须是6位数字',
            },
          ]"
        />
        <van-field
          v-model="pwdForm.payPwdAgain"
          :label-width="70"
          label="确认密码"
          type="password"
          placeholder="请再次输入支付密码"
          :rules="[
            { required: true, message: $t('backapi.passwordIsEmpty') },
            {
              validator: validateTwo,
              message: this.$t('ruls.passtwo.unequal'),
            },
          ]"
        />

        <van-button class="pwdBtn" native-type="submit">确认</van-button>
      </van-form>
    </van-dialog>

    <AppBtmBar></AppBtmBar>
    <Notice></Notice>
  </div>
</template>

<script>
import userApi from "@/api/user";
import labaImg from "@/assets/img/Index/laba.png";
import nav5Icon from "@/assets/img/Index/nav5.png";
import auth from "@/plugins/auth";
import { NoticeBar } from "vant";
import { mapGetters } from "vuex";
import Notice from "@/views/components/Notice";
export default {
  name: "AppHome",
  data() {
    return {
      loaded: false,
      show: +sessionStorage.getItem("storageShow") ? true : false,
      active: 0,
      nav5Icon,
      labaImg,
      wins: [],
      slider: [],
      version: "",
      progressBarState: false,
      fromModal2: false,
      progressBar: 0,
      key: "storageVersion",
      noticeDoc: {
        content: "",
      },
      // 支付密码设置弹窗
      showPwdForm: false,
      pwdForm: {},
    };
  },
  components: {
    NoticeBar,
    Notice,
  },
  computed: {
    ...mapGetters(["catList"]),
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
    slideCatList() {
      return this.catList;
    },
    catList() {
      const arr = [];
      this.$store.state.cat.forEach((item) => {
        arr.push(...item.list);
      });
      return arr;
    },
    itemDoc() {
      return this.$store.getters.noticeDoc;
    },
    cat() {
      return this.$store.state.cat;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    async recharge() {
      const [err, res] = await userApi.recharge();
      if (err) return;
      res.data = res.data?.filter((item) => item?.list?.length);
      if (res.data?.length) {
        this.$router.push("/recharge");
        return;
      }
      const status = await this.comfire("请联系在线客服", "在线客服");
      if (!status) return;
      this.$store.dispatch("getServeData", 1);
    },
    random() {
      //catList 随机一位
      const len = this.slideCatList.length;
      const index = Math.floor(Math.random() * len);
      return this.slideCatList[index].lotteryName;
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
    comfire2(v) {
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
    // 判断是否存在支付密码
    existPwdPay() {
      console.log(this.paySet);
      if (this.paySet !== 1) {
        this.showPwdForm = true;
        // this.$toast.fail("请先设置支付密码");
      }
    },
    validateTwo(value) {
      return value === this.pwdForm.payPwd;
    },
    // 设置支付密码
    async confirm() {
      this.$toast.success("支付密码设置成功");
      const [err] = await userApi.setPwdPay(this.pwdForm);
      if (err) return;
      await this.lazyGetUser();
      this.showPwdForm = false;
      // setTimeout(done, 1000);
    },
    async lazyGetUser() {
      await this.$store.dispatch("getInfo");
      this.$toast.clear();
    },
    async withdraw() {
      if (!this.Cards.length) {
        const status = await this.comfire2(
          "您好，您还未绑定提款方式，确定现在进行绑定？"
        );
        if (!status) return;
        this.$router.push("/paylist");
        return;
      }
      // if (this.paySet !== 1) {
      //   this.$toast.fail("请先设置支付密码");
      //   return this.$router.push("/payPassword");
      // }
      this.$router.push("/withdrawal");
    },
    async homeDialog() {
      const [err, res] = await userApi.homeDialog();
      if (err) return;
      if (!res.data?.length) return;
      this.noticeDoc = res.data[0];
    },
    simulateProgressBar() {
      this.progressBarState = true;
      var duration = Math.floor(Math.random() * 6) + 5; // 生成5到10之间的随机秒数
      var increment = 100 / (duration * 10); // 计算每100毫秒增加的进度

      var progress = 0;

      this.interval = setInterval(() => {
        progress += increment;
        this.progressBar = parseInt(progress);
        if (progress >= 100) {
          console.log("done");
          auth.setToken(this.version, this.key);
          location.reload();
          clearInterval(this.interval);
        }
      }, 100);
    },
    goDetail() {
      //p.policyType 1 余额宝 11 会员管理
      //this.$router.push(`/game/hall?id=${p.lotteryId}`);
    },
    async sliderSlide() {
      let params = {
        device: 0,
      };
      const [err, res] = await userApi.homeswiper(params);
      if (err) return;
      this.slider = res.data;
    },
    async homeWinning() {
      const [err, res] = await userApi.homeWinning();
      if (err) return;
      this.wins = res.data;
    },
    isNumber(val) {
      return typeof val === "number" && !isNaN(val);
    },
    async getVersion() {
      console.log(9999);
      const [err] = await userApi.versionReq();
      if (!this.isNumber(+err)) {
        return;
      }
      const res = +err;
      let storageVersion = auth.getToken(this.key);
      if (storageVersion && storageVersion != res) {
        this.fromModal2 = true;
        this.version = res;
      } else {
        auth.setToken(res, this.key);
      }
    },
    dilogHome() {
      // this.$dialog
      //   .alert({
      //     title: this.itemDoc.title,
      //     message: this.itemDoc.content,
      //     theme: "round-button",
      //   })
      //   .then(() => {
      //     // on close
      //   });
    },
    async showDliog() {
      await this.$store.dispatch("getNotice");
      // const dialogs = auth.getToken("dialogs")
      //   ? JSON.parse(auth.getToken("dialogs"))
      //   : [];
      // // if (!dialogs.includes(this.itemDoc.id) && this.itemDoc.id) {
      //   this.dilogHome();
      //   dialogs.push(this.itemDoc.id);
      //   //dialogs 取最后10个
      //   if (dialogs.length > 10) {
      //     dialogs.shift();
      //   }
      //   console.log(dialogs, this.itemDoc.id);
      //   auth.setToken(JSON.stringify(dialogs), "dialogs");
      // }
    },
  },
  async created() {
    this.homeDialog();
    this.showDliog();
    this.$store.dispatch("playerLotteryList");
    this.homeWinning();
    this.sliderSlide();
    this.getVersion();
    await Promise.all([
      this.$store.dispatch("getPaySet"),
      this.$store.dispatch("getBankCard"),
    ]);
    this.loaded = true;
    this.existPwdPay();
  },
  beforeDestroy() {
    if (this.show) {
      sessionStorage.setItem("storageShow", 1);
    } else {
      sessionStorage.removeItem("storageShow", 0);
    }
  },
};
</script>
<style scoped lang="less">
.index-page {
  width: 100%;
  overflow-x: hidden;
  position: relative;
}

.top-bg {
  position: absolute;
  left: -10%;
  top: 0;
  width: 120%;
  height: 310px;
  background: linear-gradient(126deg, #bf2935 0%, #bf2935 100%);
  border-radius: 0 0 20% 20%;
}

.swipe-box {
  width: 694px;
  margin: 0 auto 0;
  border-radius: 16px;
  overflow: hidden;

  .item {
    display: block;
    width: 694px;
    height: 292px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }
}

.nav-wrap {
  border-radius: 12px 12px 12px 12px;
  margin: 24px 24px 0;
  overflow: hidden;

  .notice-bar {
    .num {
      color: #e63939;
    }
  }

  .nav-box {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 34px;

    .item {
      text-align: center;
      width: 25%;
      margin-top: 24px;

      .icon {
        width: 100px;
        height: 100px;
        background-repeat: no-repeat;
        background-size: 100% auto;
        margin: 0 auto;

        &.icon-1 {
          background-image: url("@/assets/img/Index/nav1.png");
        }

        &.icon-2 {
          background-image: url("@/assets/img/Index/nav2.png");
        }

        &.icon-3 {
          background-image: url("@/assets/img/Index/nav3.png");
        }

        &.icon-4 {
          background-image: url("@/assets/img/Index/nav4.png");
        }

        &.icon-5 {
          background-image: url("@/assets/img/Index/nav5.png");
        }

        &.icon-6 {
          background-image: url("@/assets/img/Index/nav6.png");
        }

        &.icon-7 {
          background-image: url("@/assets/img/Index/nav7.png");
        }

        &.icon-8 {
          background-image: url("@/assets/img/Index/nav8.png");
        }
      }

      .name {
        font-size: 20px;
        margin-top: 10px;
      }
    }
  }
}

::v-deep {
  .van-notice-bar__left-icon {
    width: 40px;
    height: 40px;
    min-width: none;
    margin-right: 16px;

    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}

.ranking-box {
  box-shadow: 0px 4 8px 2px rgba(157, 157, 157, 0.4);
  background: #ffffff;
  border-radius: 12px 12px 12px 12px;
  margin: 38px 24px;
  background-image: url("@/assets/img/Index/jb.png");
  background-size: 456px 538px;
  background-repeat: no-repeat;
  background-position: top right;

  .title {
    height: 82px;
    line-height: 82px;
    padding: 0 28px;
    font-size: 32px;
    font-weight: 600;
  }

  .lists-box {
    .lists {
      padding: 16px 28px;
      border-top: 1px solid #e5e5e5;
      display: flex;
      align-items: center;
      font-size: 24px;

      .left {
        flex: 1;
        margin-right: 30px;

        .name {
          display: flex;
          align-items: center;
          max-width: 400px;
        }

        .icon {
          width: 44px;
          height: 44px;
          background: url("@/assets/img/Index/jiang.png") no-repeat;
          background-size: 100% auto;
          margin-right: 4px;
        }

        .des {
          margin-top: 12px;
        }
      }

      .right {
        text-align: right;
        max-width: 300px;

        .num {
          color: #bf2935;
        }
      }
    }
  }
}

.activity-pop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;

  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.8);
  }

  .pop-wrap {
    position: relative;
    width: 526px;
    height: 800px;
    background: url("@/assets/img/Index/hongbao.png") no-repeat;
    background-size: 100% auto;
    padding-top: 240px;

    .title {
      color: #ffd01d;
      font-size: 28px;
      text-align: center;
    }

    .item-box {
      width: 454px;
      margin: 20px auto 0;
      max-height: 6.2rem;
      overflow-y: auto;

      .item {
        height: 98px;
        width: 454px;
        background: url("@/assets/img/Index/hbkuai.png") no-repeat;
        background-size: 100% auto;
        margin-bottom: 12px;
        display: flex;

        .left {
          width: 130px;
          color: #bf2935;
          font-size: 32px;

          .t2 {
            font-size: 48px;
            font-size: 600;
          }
        }

        .right {
          flex: 1;
          padding: 0 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .t1 {
            font-weight: 600;
          }

          .t2 {
            color: #999999;
            font-size: 24px;
          }
        }
      }
    }
  }
}

.version-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;

  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.8);
  }

  .version-wrap {
    position: relative;
    border-radius: 6px 6px 6px 6px;
    background: #ffffff;
    width: 560px;
    height: 376px;

    .top-icon {
      position: absolute;
      width: 240px;
      height: 240px;
      left: 154px;
      top: -90px;
      background: url("@/assets/img/Index/hb.png") no-repeat;
      background-size: 100% auto;
    }

    .wrap-box {
      padding-top: 170px;

      .text {
        font-size: 32px;
        font-weight: 600;
        text-align: center;
        height: 100px;

        .num {
          color: #bf2834;
        }
      }

      .btn {
        border-top: 1px solid #e5e5e5;
        height: 98px;
        color: #bf2935;
        font-weight: 600;
        font-size: 32px;
      }

      .dex {
        color: #999999;
        font-size: 24px;
        margin-top: 10px;
      }
    }
  }
}

.my-cats {
  & > p {
    position: relative;
    padding-left: 12px;
    height: 40px;
    line-height: 1;

    &::after {
      content: "";
      display: block;
      width: 8px;
      height: 40px;
      background: #bf2834;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .hall {
    .conts {
      padding: 16px 0 16px 26px;
      background: #ffffff;
      box-shadow: 0px 2px 8px 2px rgba(157, 157, 157, 0.4);
      border-radius: 12px 12px 12px 12px;
    }

    .art {
      margin-left: 34px;
      color: #919191;

      .lotteryNameH5 {
        color: #000;
      }
    }

    .icons {
      width: 96px;
      height: 96px;
      border-radius: 50%;
    }

    & > li {
      width: 50%;
    }

    & > li:nth-child(odd) {
      padding-right: 7px;
    }

    & > li:nth-child(even) {
      padding-left: 7px;
    }
  }
}

.serve {
  position: fixed;
  right: 0;
  bottom: 140px;
  z-index: 100;
  width: 100px;
  height: 100px;
  width: 160px;
  height: 160px;
}

.index-page {
  padding-bottom: 120px + 30px;
}

.top-header {
  .lo1 {
    margin: 28px 0;
    width: 252px;
    height: 74px;
  }
}

.nav-wrap {
  background-color: #fff;
  border-radius: 8px 8px 8px 8px;

  .balance {
    color: #000;
    font-weight: bold;
  }
}

.my-nav {
  img {
    width: 60px;
    height: 60px;
  }
}

.ottery-bts {
  border-radius: 8px 8px 8px 8px;
  overflow: hidden;
  background-color: #fff;

  ::v-deep {
    .van-tabs__wrap {
      border-bottom: 2px solid #ebebeb;
    }

    .van-tab--active {
      color: #bf2935;
    }

    .van-tabs__line {
      background-color: #bf2935;
    }
  }

  img {
    width: 110px;
    height: 110px;
  }

  .nav-ottery-bt {
    padding-top: 40px;

    & > li {
      width: 25%;
      padding-bottom: 40px;
    }
  }
}

.prize-boxs {
  background: #ffffff;
  border-radius: 16px 16px 16px 16px;
}

.grid-table {
  grid-template-columns: repeat(3, 1fr);
  /* 三列等宽 */
  display: grid;
  text-align: center;
}

.prize-bg {
  background: #eeeeee;
  border-radius: 16px 16px 16px 16px;

  .prize-li {
    background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
    border-radius: 8px 8px 8px 8px;
  }
}

.grid-auto {
  height: 446px;
  overflow: hidden;

  .scroll-list {
    animation: scrollUp 10s linear infinite;
  }

  @keyframes scrollUp {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(-50%);
    }
  }
}

.my-show {
  font-size: 40px;
}
::v-deep .van-dialog__header {
  margin-bottom: 20px;
}
::v-deep .van-field__control {
  border: 2px solid #e3e1e4;
  border-radius: 12px;
  padding: 4px 10px;
}
.pwdBtn {
  width: 100%;
  color: #bf2935;
}
</style>
