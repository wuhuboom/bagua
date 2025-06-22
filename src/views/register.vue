<!-- eslint-disable prettier/prettier -->
<template>
  <div class="page">
    <AppTopBar topBarTitle="注册"></AppTopBar>
    <!-- 登录 -->
    <div class="main-box" v-if="type === 'login'">
      <van-icon name="arrow-left" class="arrow-left" color="#fff" @click="$router.push('/login/SignIn')" />
      <van-form class="full100 ntf-form" @submit="login">
        <van-field v-model.trim="form.username" autocomplete="new-password" :placeholder="$t('form.account.text')"
          class="username m-b-32 icon-input" :rules="[{ required: true, message: $t('ruls.accout.empty') }]">
        </van-field>
        <van-field class="password m-b-32 icon-input" v-model.trim="form.password" autocomplete="new-password"
          placeholder="密码(6-16位英文字母、数字)" type="password" :rules="[
            { required: true, message: $t('backapi.passwordIsEmpty') },
            { pattern: $util.regPassword, message: '密码必须包含字母和数字，长度在6-16之间' }
          ]">
        </van-field>
        <van-field class="password m-b-32 icon-input" v-model.trim="form.twoPassword" autocomplete="new-password"
          type="password" placeholder="请再次输入密码" :rules="[
            { required: true, message: $t('backapi.passwordIsEmpty') },
            {
              validator: validateTwo,
              message: this.$t('ruls.passtwo.unequal'),
            },
          ]">
        </van-field>
        <van-field v-model.trim="form.invitationCode" autocomplete="new-password" placeholder="邀请码"
          class="username m-b-32 icon-input" :rules="[{ required: true, message: '请输入邀请码' }]">
        </van-field>
        <van-field v-model.trim="form.qq" autocomplete="new-password" placeholder="请输入QQ号(必填)"
          class="username m-b-32 icon-input" :rules="[
            { required: true, message: '请输入QQ号' },
            { pattern: /^\d{4,14}$/, message: '请输入正确的QQ号' }
          ]">
        </van-field>
        <van-field v-model.trim="form.phone" autocomplete="new-password" placeholder="请输入手机号(必填)"
          class="username m-b-32 icon-input" :rules="[
            { required: true, message: '请输入手机号' },
            { pattern: /^\d{11}$/, message: '请输入正确的手机号' }
          ]" />
		<van-field
			v-model.trim="form.code"
			v-if="phoneCode" 
			autocomplete="new-password" 
			placeholder="请输入验证码(必填)"
			class="username m-b-32 icon-input" 
			:rules="[
			  { required: true, message: '请输入验证码' }
			]"
		  >
			<van-button 
				slot="button" 
				type="primary" 
				size="small" 
				plain 
				@click="startCountdown"
				class="code">
			  {{ isCounting ? countdown + "秒" : "获取验证码" }}
			</van-button>
			
		  </van-field>
        <van-button class="ntf-vant-btn" block type="info" native-type="submit">{{ $t("reg.btn.text") }}</van-button>
      </van-form>
    </div>

    <!-- 注册 -->
    <template v-if="type === 'register'">

      <div class="main-box">
        <div class="input-box center-center">
          <input type="text" class="input" placeholder="请输入您的用户名" />
        </div>
        <div class="input-box center-center">
          <input type="password" class="input" placeholder="密码(6-16位英文字母、数字)" />
        </div>
        <div class="input-box center-center">
          <input type="text" class="input" placeholder="请再次输入密码" />
        </div>
        <div class="input-box center-center">
          <input type="text" class="input" placeholder="请输入QQ号(必填)" />
        </div>
        <div class="input-box center-center">
          <input type="text" class="input" placeholder="请输入手机号(必填)" />
        </div>
		<van-field
			v-model.trim="form.code"
			v-if="phoneCode" 
			autocomplete="new-password" 
			placeholder="请输入验证码(必填)"
			class="username m-b-32 icon-input" 
			:rules="[
			  { required: true, message: '请输入验证码' }
			]"
		  >
			<van-button 
				slot="button" 
				type="primary" 
				size="small" 
				plain 
				@click="startCountdown"
				class="code">
			  {{ isCounting ? countdown + "秒" : "获取验证码" }}
			</van-button>
		  </van-field>
        <div class="input-box center-center">
          <input type="text" class="input" placeholder="推荐码(必填)" />
        </div>
        <div class="btn">立即注册</div>
      </div>
      <div class="bottom-item">我有账号 <a href="javascript:;" @click="switchType('login')">立即登录</a></div>
    </template>
  </div>
</template>

<script>
import userApi from "@/api/user";
const initForm = () => ({
  username: "",
  password: "",
  twoPassword: "",
  invitationCode: "",
  qq: "",
  phone: "",
  from: 1,
});
export default {
  name: "AppLogin",
  data() {
    return {
      countdown: 60,
      isCounting: false,
      interval: null,
      isRadio: 1,
      type: "login",
      form: initForm(),
      codeData: {},
	  phoneCode: 0,
	  isSendCode: false
    };
  },
  mounted(){
	this.getConfig()
  },
  methods: {
    async getConfig() {
      const [err, result] = await userApi.authSysconfig();
      if (err) return;
	  this.phoneCode = result.data.phoneCode
    },
    validateTwo(value) {
      return value === this.form.password;
    },
    switchType(str) {
      this.type = str;
    },
	async getPhoneCode(){
      const [err] = await userApi.phoneCodeReq_unload({phone: this.form.phone});
      if (err) {
		  if(err.data[0].msgKey == "phoneMustNumber")
			this.$toast.fail("请输入正确的手机号");
		 clearInterval(this.interval);
		 this.isCounting = false;
		 this.countdown = 60; // Reset countdown
        return;
      }
      this.$toast.success("发送成功");
	},
    async verifyCodeReq() {
      const [err, res] = await userApi.verifyCodeReq();
      if (err) {
        return;
      }
      this.form.verifyKey = res.data.verifyKey;
      this.codeData = res.data;
    },
    async login() {
      //用户名 密码不能相同
      if (this.form.username === this.form.password) {
        this.$toast.fail("用户名和密码不能相同");
        return;
      }
      this.$toast.loading({ duration: 0 });
      const [err] = await userApi.register(this.form);
      if (err) {
        return;
      }
      this.$toast.clear();
      this.$toast.success("注册成功");
      this.$router.push("/login/SignIn");
    },
	
	resCountdown() {
	  this.countdown = 60;
	  this.isCounting = false;
	  this.interval && clearInterval(this.interval);
	},
	async startCountdown() {
	  if (!this.form.phone) {
	      this.$toast.fail("请先输入手机号");
	      return;
	  }
	  if (this.isCounting) return; // Prevent multiple clicks
	  this.isCounting = true;
	  await this.getPhoneCode();
	  this.interval = setInterval(() => {
	    this.countdown--;
	    if (this.countdown <= 0) {
	      clearInterval(this.interval);
	      this.isCounting = false;
	      this.countdown = 60; // Reset countdown
	    }
	  }, 1000);
	},
  },
  created() {
    this.verifyCodeReq();
  },
  beforeDestroy() {
    this.resCountdown();
  },
};
</script>
<style scoped lang="less">
.page {
  min-height: 100vh;
  background-size: 100% auto;
  overflow: hidden;

  .code-img {
    height: 64px;
    border-radius: 18px;
  }

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
.code{
	border: 0px solid #c12e3a;
	background: transparent;
	color: #c12e3a;
}
</style>
