<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="更换手机号码"></AppTopBar>
    <div class="input-wrap">
      <div class="input-box flex-wrap">
        <div class="qh-box">+86</div>
       <input
          class="input"
          v-model.trim="phone"
          type="text"
          placeholder="请输入需要更换的手机号"
        />
      </div>
	  <div class="input-box flex-wrap" v-if="user.editp == 0">
	    <input
	      v-model.trim="pwd"
	      class="input"
	      type="text"
	      placeholder="请输入支付密码"
	    />
	  </div>
      <div class="input-box flex-wrap" v-else>
       <input
          class="input"
          v-model.trim="code"
          type="text"
          placeholder="输入验证码"
        />
        <div class="code-btn" @click="startCountdown">
          {{ isCounting ? countdown + "秒" : "获取验证码" }}
        </div>
      </div>
    </div>
    <div class="submit-btn center-center" @click="confirm">确认更改</div>
  </div>
</template>

<script>
import userApi from "@/api/user";
export default {
  name: "ChangePhone",
  data() {
    return {
      countdown: 60,
      isCounting: false,
      interval: null,
      phone: "",
      code: "",
	  pwd: ""
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    validateTwo(value) {
      return value === this.form.newpwd;
    },
    async getCode() {
      await userApi.phoneCode();
    },
    async confirm() {
      if (!this.phone) {
        this.$toast.fail("请输入手机号");
        return;
      }
	  // pattern: /^\d{6}$/
	  if (/^\d{11}$/.test(this.phone) == false) {
	    this.$toast.fail("请输入正确的手机号码");
	    return;
	  }
	  let params = {}
	  if( this.user.editp == 0){
		  let pwdPattern = new RegExp(/^\d{6}$/)
		  if (!pwdPattern.test(this.pwd)) {
			this.$toast.fail("请输入正确的支付密码");
			return;
		  }
		  params = {
			phone: this.phone,
			pwd: this.pwd,
		  }
	  }else{
	  	if (!this.code) {
	  	  this.$toast.fail("请输入验证码");
	  	  return;
	  	}	
		params = {
			phone: this.phone,
			code: this.code,
		}  
	  }
      this.loading = true;
      const [err] = await userApi.phoneBindReqV2(params);

      if (err) return;
      this.$toast.success("修改成功");
      this.$router.back();
    },
    resCountdown() {
      this.countdown = 60;
      this.isCounting = false;
      this.interval && clearInterval(this.interval);
    },
    async startCountdown() {
      if (this.isCounting) return; // Prevent multiple clicks
      this.isCounting = true;
      await this.getCode();
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
  beforeDestroy() {
    this.resCountdown();
  },
};
</script>
<style scoped lang="less">
.input-wrap {
  background: #fff;

  .qh-box {
    font-size: 32px;
    margin-right: 40px;
  }
	
  .input-box {
    padding: 2px 28px;
    border-bottom: 1px solid #e5e5e5;
    align-items: center;

    &:last-child {
      border-bottom: none;
    }
  }

  .input {
    flex: 1;
    height: 96px;
    border: none;
  }

  .code-btn {
    color: #bf2834;
  }
}
.submit-btn {
  width: 694px;
  height: 88px;
  background: #bf2935;
  border-radius: 126px 126px 126px 126px;
  color: #fff;
  font-size: 32px;
  margin: 0 auto;
  margin-top: 80px;
}
</style>
