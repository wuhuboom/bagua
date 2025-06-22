<!-- eslint-disable prettier/prettier -->
<template>
  <div class="page">
    <AppTopBar :showLeft="false" topBarTitle="登录">
      <template #right>
        <img class="d-img down-app m-r-24"  @click="$tool.goPage('/downloadApp')" src="@/assets/img/lgo.png" alt="">
      </template>
    </AppTopBar>
    <!-- 登录 -->
    <div class="main-box">
      <div class="logo-box center-center">
        <img class="d-img" :src="production ? `/static/icon.png?t=${Date.now()}` : require('@/assets/img/logo.png')" alt="">
      </div>
        <van-form class="full100 ntf-form" @submit="login">
            <van-field
              v-model.trim="form.username"
              autocomplete="new-password"
              :placeholder="$t('form.account.text')"
              class="username m-b-32 icon-input"
              :rules="[{ required: true, message: $t('ruls.accout.empty') }]"
            >
            </van-field>
            <van-field
            class="password m-b-32 icon-input"
            v-model.trim="form.password"
            autocomplete="new-password"
            :placeholder=" $t('form.password.text')"
            type="password"
            :rules="[
              { required: true, message: $t('backapi.passwordIsEmpty') },
            ]"
          >
          </van-field>
          <van-field
              v-model.trim="form.code"
              autocomplete="new-password"
              placeholder=" 验证码"
              class="username m-b-32 icon-input img-code-input"
             :rules="[{ required: true, message: '请输入验证码' }]"
            >
            <template #button>
              <img
                  class="d-img"
                  @click="verifyCodeReq"
                  :src="codeData.img"
                  alt=""
                />
            </template>
            </van-field>
            <ul class="justify-between align-center m-b-32">
              <li @click="$router.push('/login/register')">注册新账号</li>
              <li class="active" @click="$router.push('/login/forgot-password')">忘记密码?</li>
            </ul>
            <van-button
              class="ntf-vant-btn"
              block
              type="info"
              native-type="submit"
              >{{ $t("login.btn.text") }}</van-button
            >
      </van-form> 
      <div class="radio-box align-center">
        <van-checkbox class="m-r-16" icon-size="20px" v-model="isRadio" checked-color="#ee0a24"></van-checkbox>
            我已同意 <a class="active" href="javascript:;" @click="show=true">《用户协议》</a> 和
            <a class="active"  href="javascript:;" @click="show=true">《隐私政策》</a>
      </div>
    </div>
    <van-popup v-model="show" position="bottom" >
     <Notice @back="show=false" />
    </van-popup>
  </div>
</template>

<script>
import userApi from "@/api/user";
import Notice from "@/components/Notice";
import auth from "@/plugins/auth";
const initForm = () => ({
  username: "",
  password: "",
  code: "",
  verifyKey: "",
  from: 1,
});
export default {
  name: "AppLogin",
  data() {
    return {
      show: false,
      isRadio: true,
      type: "login",
      form: initForm(),
      codeData: {},
    };
  },
  components: { Notice },
  computed: {
    production() {
      return process.env.NODE_ENV === "production";
    },
  },
  methods: {
    async verifyCodeReq() {
      const [err, res] = await userApi.verifyCodeReq();
      if (err) {
        return;
      }
      this.form.verifyKey = res.data.verifyKey;
      this.codeData = res.data;
    },
    async login() {
      if (!this.isRadio) {
        this.$toast.fail("请同意用户协议和隐私政策");
        return;
      }
      this.$toast.loading({ duration: 0 });
      const [err, res] = await userApi.login(this.form);
      if (err) {
        this.form.code = "";
        this.verifyCodeReq();
        return;
      }
      this.$toast.clear();
      this.$store.commit("setToken", res.data.token);
      // this.$store.commit("setwithdrawalLimitMsg", res.data.withdrawalLimitMsg);
	  if(res.data.withdrawalLimit == 1){
		this.$dialog
		  .alert({
		    message: res.data.withdrawalLimitMsg,
		    // className: "online-serve-dialog",
		    theme: "round-button",
		    closeOnClickOverlay: false, // 允许点击背景关闭
		    confirmButtonText: '关闭',
		  })
		  .then(() => {
		  })
		  .catch(() => {
		  });
	  }
      auth.clearToken("dialogs");
      this.$router.push("/");
    },
  },
  created() {
    this.verifyCodeReq();
  },
};
</script>
<style scoped lang="less">
.page {
  min-height: 100vh;
  background-size: 100% auto;
  overflow: hidden;
  .main-box {
    width: 678px;
    background: #fff;
    border-radius: 12px 12px 12px 12px;
    margin: 0 auto;
    padding: 76px 60px 40px;
    .input-box {
      background: #f6f8f8;
      border-radius: 58px;
      height: 108px;
      margin-bottom: 30px;
      padding: 0 40px;

      input {
        background: #f6f8f8;
        border: none;
        flex: 1;
        font-size: 32px;
        height: 108px;
      }

      .img-code {
        width: 146px;
        height: 64px;
        background: #ffffff;
        border-radius: 18px 18px 18px 18px;
        border: 2px solid #707070;
      }
    }

    .info-link {
      font-size: 30px;
      justify-content: space-between;
      margin-top: 50px;

      .link-1 {
        color: #2c2c2c;
      }

      .link-2 {
        color: #bf2935;
      }
    }

    .btn {
      height: 108px;
      line-height: 108px;
      background: linear-gradient(130deg, #ca404b 0%, #bf2935 100%);
      border-radius: 56px 56px 56px 56px;
      margin-top: 50px;
      color: #fff;
      font-size: 36px;
      text-align: center;
    }

    .radio-box {
      margin-top: 50px;

      .radio {
        color: #999;
        height: 50px;
        line-height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;

        a {
          color: #c12e3a;
        }
      }
    }
  }

  .arrow-left {
    position: fixed;
    top: 40px;
    left: 30px;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 38px;
  }

  .bottom-item {
    font-size: 30px;
    text-align: center;
    margin-top: 22px;
    margin-bottom: 100px;

    a {
      color: #4029d8;
    }
  }
}
.logo-box {
  img {
    width: 192px;
    height: 192px;
    margin-top: 50px;
    margin-bottom: 60px;
  }
}
.down-app {
  width: 129px;
  height: 38px;
}
.img-code-input {
  ::v-deep {
    .van-field__button {
      width: 234px;
      border-radius: 18px;
      overflow: hidden;
      padding-left: 0;
    }
  }
}
</style>
