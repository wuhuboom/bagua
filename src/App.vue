<template>
  <div id="app" :style="topBar">
    <router-view name="AppTopBar"></router-view>
    <!-- <keep-alive>
      <router-view v-if="isCashier" :key="$route.fullPath" />
    </keep-alive>

    <router-view v-if="!isCashier" :key="$route.fullPath" /> -->

    <keep-alive :include="keepAliveRouteName">
      <router-view :key="$route.fullPath" />
    </keep-alive>

    <router-view name="AppBtmBar"></router-view>
    <RepairDilog />
  </div>
</template>
<script>
import userApi from "@/api/user";
import RepairDilog from "@/components/RepairDilog";
import i18n from "@/locale";
import auth from "@/plugins/auth";
export default {
  name: "App",
  data() {
    return {
      keepAliveRoutePath: ["/documentation", "/myBallRecord"],
      keepAliveRouteName: ["AppDocumentation", "MyBallRecord","AppChat"],
    };
  },
  watch: {
    "$route.name"(v) {
      console.log(
        "缓存路由名称是否包含",
        this.keepAliveRouteName.includes(v),
        v
      );
    },
    "$route.fullPath"(v) {
      console.log(this.keepAliveRoutePath.includes(v), v);
    },
  },
  components: {
    RepairDilog,
  },
  computed: {
    isCashier() {
      return this.keepAliveRoutePath.includes(this.$route.fullPath);
    },
    user() {
      return this.$store.state.user;
    },
    topBar() {
      if (!this.$store.state.setPdTop) {
        return {
          paddingTop: 0,
        };
      }
      return {};
    },
  },
  methods: {
	  detectApp(){
	    const ua = navigator.userAgent.toLowerCase();
	    return {
	      isWeChat: ua.includes("micromessenger"),
	      isQQ: ua.includes("qq/") || ua.includes("qqbrowser"),
	      isTelegram: ua.includes("telegram"),
	    };
	  }
  },
  created() {
    window.$router = this.$router;
	let result = this.detectApp();
	if (result.isWeChat) {
	  console.log("在微信中打开");
	  this.$router.replace('/Jump');
	} else if (result.isQQ) {
	  console.log("在QQ中打开");
	  this.$router.replace('/Jump');
	} else if (result.isTelegram) {
	  console.log("在Telegram中打开");
	  this.$router.replace('/Jump');
	} else {
	  console.log("未知或普通浏览器");
	}
	
	
    setInterval(() => {
      //获取环境变量
      if (process.env.NODE_ENV === "development") {
        return;
      }
      if (auth.getToken()) {
        this.$store.dispatch("getInfo");
      } else {
        userApi.versionReq();
      }
    }, 3000);
  },
};
</script>
<style lang="less">
#app {
  // padding-top: @navHeight;
  font-size: 28px;
  min-width: 100%;
  min-height: 100%;
	
  .appp-top-bar {
    position: fixed;
    height: 90px;
    z-index: 1000;
    top: 0;
    left: 0;
    right: 0;

    .appp-top-cont {
      height: 90px;
      width: 100%;
    }
	

    .appp-top-bar-title {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      font-size: 34px;
      height: 90px;
      color: #000;
      flex: 1;
      text-align: center;
    }

    .icon-button {
      background-color: transparent;
      border-color: transparent;
      color: var(--color-text);
      position: relative;
      z-index: 1;

      .van-icon {
        font-size: 40px;
      }
    }
  }
  
  @media (min-width: 750px) {
    .appp-top-bar {
        position: inherit;
        width: 100%;
		max-width: inherit;
        height: 2.8rem;
		line-height: 2.8rem;
		
		.appp-top-cont {
			height: 2.8rem;
			line-height: 2.8rem;
		  width: 100%;
		}
		.appp-top-bar-title{
			position: inherit;
			height: 2.8rem;
			line-height: 2.8rem;
			font-size: 96px !important;
		}
    }
  }
}
</style>
