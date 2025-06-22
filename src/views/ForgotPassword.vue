<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="忘了密码"></AppTopBar>
    <van-form @submit="confirm">
      <div class="forms-input-wrap">
        <div class="input-box flex-wrap">
          <van-field
            v-model.trim="form.username"
            class="input"
            type="text"
            autocomplete="new-password"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '用户名不能为空' }]"
          />
        </div>
        <div class="input-box flex-wrap">
          <van-field
            v-model.trim="form.newPwd"
            class="input"
            type="password"
            autocomplete="new-password"
            placeholder="请输入新密码"
            :rules="[
              { required: true, message: $t('backapi.passwordIsEmpty') },
              {
                pattern: $util.regPassword,
                message: '密码必须包含字母和数字，长度在6-16之间',
              },
            ]"
          />
        </div>
        <div class="input-box flex-wrap">
          <van-field
            v-model.trim="form.twoPassword"
            class="input"
            type="password"
            autocomplete="new-password"
            placeholder="再次输入密码"
            :rules="[
              { required: true, message: $t('backapi.passwordIsEmpty') },
              {
                validator: validateTwo,
                message: this.$t('ruls.passtwo.unequal'),
              },
            ]"
          />
        </div>
        <div class="input-box flex-wrap">
          <van-field
            v-model.trim="form.code"
            class="input"
            type="text"
            autocomplete="new-password"
            placeholder="输入验证码"
            :rules="[{ required: true, message: '验证码不能为空' }]"
          />
          <div class="code-btn" @click="startCountdown">
            {{ isCounting ? countdown + "秒" : "获取验证码" }}
          </div>
        </div>
      </div>
      <van-button class="forms-submit-btn center-center" native-type="submit"
        >确认更改</van-button
      >
    </van-form>
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
        username: "",
        newPwd: "",
        code: "",
        twoPassword: "",
      },
      showReg: false,
    };
  },
  methods: {
    validateTwo(value) {
      return value === this.form.newPwd;
    },
    async getCode() {
      await userApi.notLoginchangePwd({
        username: this.form.username,
      });
    },
    async confirm() {
      if (this.loading) return;
      this.loading = true;
      const [err] = await userApi.phoneChangePwdReq(this.form);
      this.loading = false;
      if (err) return;
      this.$toast.success("修改成功, 请登录");
      this.$router.back();
    },
    resCountdown() {
      this.countdown = 60;
      this.isCounting = false;
      this.interval && clearInterval(this.interval);
    },
    async startCountdown() {
      if (!this.form.username) {
        this.$toast("请输入用户名");
        return;
      }
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
<style scoped lang="less"></style>
