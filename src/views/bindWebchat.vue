<template>
  <div class="c-page bg-grey">
    <AppTopBar
      :topBarTitle="usdtCard.id ? '修改微信账号' : '绑定微信账号'"
    ></AppTopBar>
    <van-form @submit="confirm">
      <div class="forms-input-wrap">
        <div class="input-box flex-wrap">
          <van-field
            v-model.trim="form.payPwd"
            class="input"
            type="password"
            placeholder="输入支付密码"
            :rules="[
              { required: true, message: $t('backapi.passwordIsEmpty') },
              {
                pattern: /^\d{6}$/,
                message: '支付密码必须是6位数字',
              },
            ]"
          />
        </div>
        <div class="input-box flex-column">
          <p class="input-title p-t-16 p-b-16">上传微信收款码</p>
          <van-uploader v-model="fileList" :max-count="1" />
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
      fileList: [],
      form: {
        ctype: 1,
        identity: "",
        cardNumber: "",
        bankName: "微信",
        payPwd: "",
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
      const doc = this.Cards.find((v) => +v.ctype === 1) || {};
      if (doc.payQr) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fileList = [
          {
            url: doc.payQr.includes("http")
              ? doc.payQr
              : `${this.$baseURL}/${doc.payQr}`,
          },
        ];
      }
      return doc;
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
      if (!this.fileList.length) {
        return this.$toast.fail("请上传微信收款码");
      }
      const query = {
        ...this.form,
        cardNumberTwice: this.form.cardNumber,
      };
      if (this.fileList[0].file) {
        query.file = this.fileList[0].file;
      }
      this.$toast.loading({ duration: 0 });
      const keys = this.usdtCard.id ? "bindBankCardEditReq" : "bindBankCard";
      const [err] = await userApi[`${keys}`](query);

      if (err) return;
      this.$toast.success("绑定成功");
      this.$router.back();
      this.$store.dispatch("getBankCard");
    },
  },
  async created() {
    await this.$store.dispatch("getBankCard");
    Object.assign(this.form, this.usdtCard);
  },
};
</script>
<style scoped lang="less"></style>
