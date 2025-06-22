import auth from "@/plugins/auth";
import store from "@/store";
import Nprogress from "nprogress";
import Vue from "vue";
import VueRouter from "vue-router";
//import app from "@/main";
Vue.use(VueRouter);
//import AppTopBar from "@/components/global/AppTopBar";
// import AppBtmBar from "@/components/global/AppBtmBar";
import app from "@/main";
const routes = [
  {
    path: "/",
    name: "Home",
    components: {
      default: () => import("@/views/Index.vue"),
    },
  },
  {
    path: "/bindCard",
    name: "BindCard",
    components: {
      default: () => import("@/views/bindCard.vue"),
    },
  },
  {
    path: "/downloadApp",
    name: "downloadApp",
    components: {
      default: () => import("@/views/downloadApp.vue"),
    },
  },
  {
    path: "/edtMyCard",
    name: "EdtMyCard",
    components: {
      default: () => import("@/views/edtBindCard.vue"),
    },
  },
  {
    path: "/GiftRecord",
    name: "GiftRecord",
    components: {
      default: () => import("@/views/GiftRecord.vue"),
    },
  },
  {
    path: "/myBallRecord",
    name: "MyBallRecord",
    components: {
      default: () => import("@/views/MyBallRecord.vue"),
    },
  },
  {
    path: "/FundDetail",
    name: "FundDetail",
    components: {
      default: () => import("@/views/FundDetail.vue"),
    },
  },
  {
    path: "/BalanceVault",
    name: "BalanceVault",
    components: {
      default: () => import("@/views/BalanceVault.vue"),
    },
  },
  {
    path: "/bindGOpay",
    name: "BindGOpay",
    components: {
      default: () => import("@/views/bindGOpay.vue"),
    },
  },
  {
    path: "/bindUsdt",
    name: "BindUsdt",
    components: {
      default: () => import("@/views/bindUsdt.vue"),
    },
  },
  {
    path: "/bindWebchat",
    name: "BindWebchat",
    components: {
      default: () => import("@/views/bindWebchat.vue"),
    },
  },
  {
    path: "/bindAlipay",
    name: "BindAlipay",
    components: {
      default: () => import("@/views/bindAlipay.vue"),
    },
  },
  {
    path: "/RechargeRecord",
    name: "RechargeRecord",
    components: {
      default: () => import("@/views/RechargeRecord.vue"),
    },
  },
  {
    path: "/WithdrawRecord",
    name: "WithdrawRecord",
    components: {
      default: () => import("@/views/WithdrawRecord.vue"),
    },
  },
  {
    path: "/payPassword",
    name: "PayPassword",
    components: {
      default: () => import("@/views/payPassword.vue"),
    },
  },
  {
    path: "/invoice",
    name: "invoice",
    components: {
      default: () => import("@/views/invoice.vue"),
    },
  },
  {
    path: "/login/register",
    name: "LoginForget",
    components: {
      default: () => import("@/views/register.vue"),
    },
  },
  {
    path: "/login/SignIn",
    name: "Login",
    components: {
      default: () => import("@/views/Login.vue"),
    },
  },
  {
    path: "/login/forgot-password",
    name: "ForgotPassword",
    components: {
      default: () => import("@/views/ForgotPassword.vue"),
    },
  },
  {
    path: "/no-network",
    name: "NoNetwork",
    components: {
      default: () => import("@/views/NoNetwork.vue"),
    },
  },
  {
    path: "/notice",
    name: "AppNotice",
    components: {
      default: () => import("@/views/Notice.vue"),
    },
  },
  {
    path: "/notice-details",
    name: "NoticeDetails",
    components: {
      default: () => import("@/views/NoticeDetails.vue"),
    },
  },
  {
    path: "/winning-list",
    name: "WinningList",
    components: {
      default: () => import("@/views/WinningList.vue"),
    },
  },
  {
    path: "/honor-roll",
    name: "HonorRoll",
    components: {
      default: () => import("@/views/HonorRoll.vue"),
    },
  },
  {
    path: "/my-follow",
    name: "MyFollow",
    components: {
      default: () => import("@/views/MyFollow.vue"),
    },
  },
  {
    path: "/game/hall",
    name: "Welfare3D",
    components: {
      default: () => import("@/views/Welfare3D.vue"),
    },
  },
  {
    path: "/draw-winner",
    name: "DrawWinner",
    components: {
      default: () => import("@/views/DrawWinner.vue"),
    },
  },
  {
    path: "/chat",
    name: "AppChat",
    components: {
      default: () => import("@/views/chat/Chat.vue"),
    },
  },
  // {
  //   path: "/bet-on",
  //   name: "BetOn",
  //   components: {
  //     default: () => import("@/views/BetOn.vue"),
  //   },
  // },
  // {
  //   path: "/buy-together",
  //   name: "BuyTogether",
  //   components: {
  //     default: () => import("@/views/BuyTogether.vue"),
  //   },
  // },
  {
    path: "/draw-winner-result",
    name: "DrawWinnerResult",
    components: {
      default: () => import("@/views/DrawWinnerResult.vue"),
    },
  },
  {
    path: "/documentation",
    name: "AppDocumentation",
    components: {
      default: () => import("@/views/Documentation.vue"),
    },
  },
  {
    path: "/my-buy",
    name: "MyBuy",
    components: {
      default: () => import("@/views/MyBuy.vue"),
    },
  },
  {
    path: "/ta-page",
    name: "TaPage",
    components: {
      default: () => import("@/views/TaPage.vue"),
    },
  },
  {
    path: "/buy-details",
    name: "BuyDetails",
    components: {
      default: () => import("@/views/BuyDetails.vue"),
    },
  },
  // {
  //   path: "/append-chase",
  //   name: "AppendChase",
  //   components: {
  //     default: () => import("@/views/AppendChase.vue"),
  //   },
  // },
  {
    path: "/my",
    name: "AppMy",
    components: {
      default: () => import("@/views/My.vue"),
    },
  },
  {
    path: "/recharge",
    name: "AppRecharge",
    components: {
      default: () => import("@/views/Recharge.vue"),
    },
  },
  {
    path: "/withdrawal",
    name: "AppWithdrawal",
    components: {
      default: () => import("@/views/Withdrawal.vue"),
    },
  },
  {
    path: "/paylist",
    name: "AppPaylist",
    components: {
      default: () => import("@/views/paylist.vue"),
    },
  },
  {
    path: "/bank-card",
    name: "BankCard",
    components: {
      default: () => import("@/views/BankCard.vue"),
    },
  },
  {
    path: "/binding",
    name: "AppBinding",
    components: {
      default: () => import("@/views/Binding.vue"),
    },
  },
  {
    path: "/withdrawal-record",
    name: "WithdrawalRecord",
    components: {
      default: () => import("@/views/WithdrawalRecord.vue"),
    },
  },
  {
    path: "/withdrawal-details",
    name: "WithdrawalDetails",
    components: {
      default: () => import("@/views/WithdrawalDetails.vue"),
    },
  },
  {
    path: "/recharge-details",
    name: "RechargeDetails",
    components: {
      default: () => import("@/views/RechargeDetails.vue"),
    },
  },
  {
    path: "/set-up",
    name: "SetUp",
    components: {
      default: () => import("@/views/SetUp.vue"),
    },
  },
  {
    path: "/user-center",
    name: "UserCenter",
    components: {
      default: () => import("@/views/UserCenter.vue"),
    },
  },
  {
    path: "/purchase-record",
    name: "PurchaseRecord",
    components: {
      default: () => import("@/views/PurchaseRecord.vue"),
    },
  },
  {
    path: "/purchase-group",
    name: "PurchaseGroup",
    components: {
      default: () => import("@/views/PurchaseGroup.vue"),
    },
  },
  {
    path: "/purchase-record-details",
    name: "PurchaseRecordDetails",
    components: {
      default: () => import("@/views/PurchaseRecordDetails-copy.vue"),
    },
  },
  {
    path: "/purchase-record-details2",
    name: "PurchaseRecordDetails",
    components: {
      default: () => import("@/views/PurchaseRecordDetails.vue"),
    },
  },
  {
    path: "/purchase-my-details",
    name: "PurchaseMyDetails",
    components: {
      default: () => import("@/views/PurchaseMydDetails.vue"),
    },
  },
  {
    path: "/purchase-pre-details",
    name: "PurchasePreDetails",
    components: {
      default: () => import("@/views/PurchasePreDetails.vue"),
    },
  },
  {
    path: "/financial-details",
    name: "FinancialDetails",
    components: {
      default: () => import("@/views/FinancialDetails.vue"),
    },
  },
  {
    path: "/collection-details",
    name: "CollectionDetails",
    components: {
      default: () => import("@/views/collectionDetail.vue"),
    },
  },
  {
    path: "/my-discount",
    name: "MyDiscount",
    components: {
      default: () => import("@/views/MyDiscount.vue"),
    },
  },
  {
    path: "/change-password",
    name: "ChangePassword",
    components: {
      default: () => import("@/views/ChangePassword.vue"),
    },
  },
  {
    path: "/nick-name",
    name: "NickName",
    components: {
      default: () => import("@/views/NickName.vue"),
    },
  },
  {
    path: "/name-authentication",
    name: "NameAuthentication",
    components: {
      default: () => import("@/views/NameAuthentication.vue"),
    },
  },
  {
    path: "/change-phone",
    name: "ChangePhone",
    components: {
      default: () => import("@/views/ChangePhone.vue"),
    },
  },
  {
    path: "/promotion-commission",
    name: "PromotionCommission",
    components: {
      default: () => import("@/views/PromotionCommission.vue"),
    },
  },
  {
    path: "/promotion-team",
    name: "PromotionTeam",
    components: {
      default: () => import("@/views/viewDiaolog.vue"),
    },
  },
  {
    path: "/invite-friends",
    name: "InviteFriends",
    components: {
      default: () => import("@/views/InviteFriends.vue"),
    },
  },
  {
    path: "/about-us",
    name: "AboutUs",
    components: {
      default: () => import("@/views/AboutUs.vue"),
    },
  },
  {
    path: "/feed-back",
    name: "FeedBack",
    components: {
      default: () => import("@/views/FeedBack.vue"),
    },
  },
  {
    path: "/joint-purchase",
    name: "JointPurchase",
    components: {
      default: () => import("@/views/JointPurchase.vue"),
    },
  },
];

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  },
});
router.beforeEach(async (to, from, next) => {
  Nprogress.start();

  if (auth.getToken() && !store.state.user.id) {
    const [error] = await store.dispatch("getInfo");
    if (error && auth.getToken("userInfo")) {
      store.commit("setUser", JSON.parse(auth.getToken("userInfo")));
    }
  }
  // const ajaxs = [];
  // if (!store.state.serveData.serviceAddr) {
  //   ajaxs.push(store.dispatch("getServeData"));
  // }
  // if (!store.getters.catList.length) {
  //   ajaxs.push(store.dispatch("playerLotteryList"));
  // }
  // await Promise.all(ajaxs);
  if (to.path == "/downloadApp") {
    next();
    return;
  }
  if (auth.getToken()) {
    if (!store.getters.catList.length) {
      await store.dispatch("playerLotteryList");
    }
    if (to.path.includes("/login")) {
      Nprogress.done();
      next("/");
    } else {
      next();
    }
  } else {
    if (to.path.includes("/login")) {
      next();
    } else {
      Nprogress.done();
      next("/login/SignIn");
    }
  }
  next();
});
router.afterEach((to, from) => {
  store.commit("setPdTop", true);
  Nprogress.done();
  app.$store.commit("setFromRoute", from);
});

const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch((err) => err);
};
export default router;
