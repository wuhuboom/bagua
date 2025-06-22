<template>
  <div class="c-page bg-grey">
    <AppTopBar
      :topBarTitle="usdtCard.id ? '修改支付宝账号' : '绑定支付宝账号'"
    ></AppTopBar>
    <van-form @submit="confirm">
      <div class="forms-input-wrap">
        <div class="input-box flex-wrap">
          <van-field
            v-model.trim="form.cardName"
            class="input"
            type="text"
            placeholder="请输入姓名"
            :rules="[
              {
                required: true,
                message: '姓名不能为空',
              },
            ]"
          />
        </div>
        <div class="input-box flex-wrap">
          <van-field
            v-model.trim="form.cardNumber"
            class="input"
            type="text"
            placeholder="请输入支付宝账号"
            :rules="[
              {
                required: true,
                message: '支付宝账号不能为空',
              },
            ]"
          />
        </div>
        <div class="input-box flex-wrap">
          <van-field
            v-model.trim="form.payPwd"
            class="input"
            type="password"
            placeholder="支付密码"
            :rules="[
              { required: true, message: $t('backapi.passwordIsEmpty') },
              {
                pattern: /^\d{6}$/,
                message: '支付密码必须是6位数字',
              },
            ]"
          />
        </div>
      </div>
      <van-button class="forms-submit-btn center-center" native-type="submit"
        >确定</van-button
      >
    </van-form>
  </div>
</template>

<script>
import userApi from "@/api/user";
export default {
  name: "bindCard",
  data() {
    return {
      form: {
        ctype: 0,
        identity: "",
        cardNumber: "",
        bankName: "支付宝",
        payPwd: "",
        cardName: "",
      },
    };
  },
  computed: {
    Cards() {
      return this.$store.state.bankCard;
    },
    bankCard() {
      const doc = this.Cards.find((v) => +v.ctype === 2) || {};
      return doc;
    },
    usdtCard() {
      return this.Cards.find((v) => +v.ctype === 0) || {};
    },
  },
  methods: {
    bankCardValidator(value) {
      const bankCardPattern = /^\d{16,19}$/;
      return bankCardPattern.test(value);
    },
    idCardValidator(value) {
      const idCardPattern =
        /^(^[1-9]\d{5}(18|19|20|21|22|23|24|25|26|27|28|29)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}(\d|X|x)$)$/;
      return idCardPattern.test(value);
    },
    async confirm() {
      this.$toast.loading({ duration: 0 });
      const keys = this.usdtCard.id ? "bindBankCardEditReq" : "bindBankCard";
      const [err] = await userApi[`${keys}`]({
        ...this.form,
        cardNumberTwice: this.form.cardNumber,
      });

	  if(err){
	  	if(err.code == 103 && err.data[0].msgKey == "bankCardUsed"){
	  	  this.$toast.fail("已被使用");
	  	}	
	  }
	  else{
		this.$toast.success("绑定成功");
		this.$router.back();
		this.$store.dispatch("getBankCard");
	  }
	  
      // if (err) return;
      // this.$toast.success("绑定成功");
      // this.$router.back();
      // this.$store.dispatch("getBankCard");
    },
  },
  async created() {
    await this.$store.dispatch("getBankCard");
    Object.assign(this.form, this.usdtCard);
  },
};
</script>
<style scoped lang="less"></style>
