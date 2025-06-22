<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="修改密码"></AppTopBar>
	<van-tabs v-model="activeName">
	  <van-tab name="pwd" title="设置登录密码">
		  
		  <van-form @submit="confirmPwd">
		    <div class="forms-input-wrap">
			
			  <div class="input-box flex-wrap">
			    <van-field
			      v-model.trim="pwdForm.origin"
			      class="input"
			      type="text"
			      placeholder="请输入旧登录密码"
			      :rules="[
			        { required: true, message: $t('backapi.passwordIsEmpty') },
			        {
			          pattern: /^.{6,16}$/,
			          message: '密码长度为6-16位',
			        },
			      ]"
			    />
			  </div>
		      <div class="input-box flex-wrap">
		        <van-field
		          v-model.trim="pwdForm.newpwd"
		          class="input"
		          type="text"
		          placeholder="请输入新登录密码"
		          :rules="[
		            { required: true, message: $t('backapi.passwordIsEmpty') },
		            {
		              pattern: /^.{6,16}$/,
		              message: '密码长度为6-16位',
		            },
		          ]"
		        />
		      </div>
		      <div class="input-box flex-wrap">
		        <van-field
		          v-model.trim="pwdForm.confirmed"
		          class="input"
		          type="text"
		          placeholder="请再次输入密码"
		          :rules="[
		            { required: true, message: $t('backapi.passwordIsEmpty') },
		            {
		              validator: pwdValidateTwo,
		              message: this.$t('ruls.passtwo.unequal'),
		            },
		          ]"
		        />
		      </div>
		    </div>
		    <van-button class="forms-submit-btn center-center" native-type="submit"
		      >确认更改</van-button
		    >
		  </van-form>
	  </van-tab>
	  <van-tab name="mPwd" title="设置支付密码">
		  <van-form @submit="confirm">
		    <div class="forms-input-wrap">
			
			  <div class="input-box flex-wrap">
			    <van-field
			      v-model.trim="form.origin"
			      class="input"
			      type="text"
			      placeholder="请输入旧的支付密码"
			      :rules="[
			        { required: true, message: $t('backapi.passwordIsEmpty') },
			        {
			          pattern: /^\d{6}$/,
			          message: '支付密码必须是6位数字',
			        },
			      ]"
			    />
			  </div>
		      <div class="input-box flex-wrap">
		        <van-field
		          v-model.trim="form.payPwd"
		          class="input"
		          type="text"
		          placeholder="请输入新的支付密码"
		          :rules="[
		            { required: true, message: $t('backapi.passwordIsEmpty') },
		            {
		              pattern: /^\d{6}$/,
		              message: '支付密码必须是6位数字',
		            },
		          ]"
		        />
		      </div>
		      <div class="input-box flex-wrap">
		        <van-field
		          v-model.trim="form.payPwdAgain"
		          class="input"
		          type="text"
		          placeholder="请再次输入密码"
		          :rules="[
		            { required: true, message: $t('backapi.passwordIsEmpty') },
		            {
		              validator: validateTwo,
		              message: this.$t('ruls.passtwo.unequal'),
		            },
		          ]"
		        />
		      </div>
		    </div>
		    <van-button class="forms-submit-btn center-center" native-type="submit"
		      >确认更改</van-button
		    >
		  </van-form>
	  </van-tab>  
	</van-tabs>
  </div>
</template>

<script>
import userApi from "@/api/user";
export default {
  name: "RegisterDialog",
  data() {
    return {
      countdown: 60,
      isCounting: false,
      interval: null,
      loading: false,
      form: {
        origin: "",
        payPwd: "",
        payPwdAgain: "",
      },
      pwdForm: {
        origin: "",
        newpwd: "",
        confirmed: "",
      },
      showReg: false,
    };
  },
  methods: {
    validateTwo(value) {
      return value === this.form.payPwd;
    },
    pwdValidateTwo(value) {
      return value === this.pwdForm.newpwd;
    },
    async getCode() {
      await userApi.phoneCode();
    },
    async lazyGetUser() {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      await this.sleep(1500);
      await this.$store.dispatch("getInfo");
      this.$toast.clear();
    },
    async confirm() {
      if (this.loading) return;
      this.loading = true;
      const [err] = await userApi.editPwdPayV2(this.form);
      this.loading = false;
      if (err) return;
      await this.lazyGetUser();
      this.$toast.success("支付密码设置成功");
      this.$router.back();
    },
    async confirmPwd() {
      if (this.loading) return;
      this.loading = true;
      const [err] = await userApi.editPwd(this.pwdForm);
      this.loading = false;
      if (err) return;
      await this.lazyGetUser();
      this.$toast.success("登录密码设置成功");
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
::v-deep .van-tabs__line{
	width: 50%;
}
::v-deep .van-form{
	margin-top: 20px;
}
::v-deep .forms-input-wrap .input-box{
	border-bottom: 2px solid #e5e5e5;
}
</style>
