<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="绑定银行卡"></AppTopBar>
    <van-form @submit="confirm">
      <div class="forms-input-wrap">
        <div class="input-box flex-wrap">
          <van-field
            v-model.trim="form.cardName"
            class="input"
            type="text"
            placeholder="请输入持卡人"
            :rules="[{ required: true, message: '持卡人不能为空' }]"
          />
        </div>
        <div class="input-box flex-wrap">
          <van-field
            v-model.trim="form.identity"
            class="input"
            type="text"
            placeholder="请输入身份证"
            :rules="[
              { required: true, message: '身份证不能为空' },
              {
                validator: idCardValidator,
                message: '请输入有效的身份证号',
              },
            ]"
          />
        </div>
        <div class="input-box flex-wrap">
          <van-field
            v-model.trim="form.cardNumber"
            class="input"
            type="text"
            placeholder="请输入银行卡号"
            :rules="[
              { required: true, message: '银行卡号不能为空' },
              {
                validator: bankCardValidator,
                message: '请输入有效的银行卡号',
              },
            ]"
          />
        </div>
        <div class="input-box flex-wrap">
          <van-field
            v-model.trim="form.bankName"
            class="input"
            type="text"
            placeholder="请输入银行名称"
            :rules="[{ required: true, message: '银行名称不能为空' }]"
          />
        </div>
        <div class="input-box flex-wrap">
          <van-field
            v-model.trim="form.subBranch"
            class="input"
            type="text"
            placeholder="请输入开户支行"
            :rules="[{ required: true, message: '开户支行不能为空' }]"
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
        ctype: 2,
        cardName: "",
        identity: "",
        cardNumber: "",
        bankName: "",
        subBranch: "",
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
      return this.Cards.find((v) => +v.ctype === 3) || {};
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
      const [err] = await userApi.bindBankCard({
        ...this.form,
        cardNumberTwice: this.form.cardNumber,
      });
	  
      // if (err) return;
	  
	  if(err){
	  	if(err.code == 103 && err.data[0].msgKey == "bankCardUsed"){
	  	  this.$toast.fail("卡号已被使用");
	  	}	
	  }
	  else{
	  	this.$toast.success("绑定成功");
	  	this.$router.back();
	  	this.$store.dispatch("getBankCard");
	  }
    },
  },
  async created() {
    await this.$store.dispatch("getBankCard");
  },
};
</script>
<style scoped lang="less"></style>
