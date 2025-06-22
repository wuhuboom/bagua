<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="个人中心"></AppTopBar>
    <div class="item-box">
      <div class="item">
        <div class="left">头像</div>
        <div class="right">
          <van-uploader :after-read="afterRead" accept="image/*">
            <div class="center-center">
              <img
                :src="
                  user.headerImg
                    ? `${$baseURL}/${user.headerImg}`
                    : DefaultAvatar
                "
                class="img"
              />
              <van-icon name="arrow" class="arrow-icon" />
            </div>
          </van-uploader>
        </div>
      </div>
    </div>
    <div class="item-box">
		<div class="item">
		  <!-- @click="$tool.goPage('/nick-name')" -->
		  <div class="left">昵称</div>
		  <div class="right">
		    {{ user.nickname }}
		  </div>
		</div>
		<div class="item" @click="$tool.goPage('/payPassword')">
		  <div class="left">修改密码</div>
		  <div class="right">
		    <van-icon name="arrow" class="arrow-icon" />
		  </div>
		</div>
      <!-- <div class="item" @click="$tool.goPage('/name-authentication')">
        <div class="left">实名认证</div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div> -->
      <div
        class="item"
        v-if="typeList.includes(2)"
        @click="$tool.goPage(bankCard.id ? '/edtMyCard' : '/bindCard')"
      >
        <div class="left">我的银行卡</div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div class="item" @click="bindUsdt" v-if="typeList.includes(3)">
        <div class="left">我的USDT</div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div class="item" @click="bindGOpay" v-if="typeList.includes(4)">
        <div class="left">我的GOpay</div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div class="item" @click="bindAlipay" v-if="typeList.includes(0)">
        <div class="left">我的支付宝账号</div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div class="item" @click="bindWebchat" v-if="typeList.includes(1)">
        <div class="left">我的微信账号</div>
        <div class="right">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div class="item" @click="$tool.goPage('/change-phone')">
        <div class="left">手机号码</div>
        <div class="right">
          {{ user?.phoneStr }}
          <!-- {{ user.phone?.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") }} -->
          <!--user.phone 188****3221 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/user";
import DefaultAvatar from "@/assets/img/DefaultAvatar.jpg";
export default {
  name: "UserCenter",
  data() {
    return { DefaultAvatar };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    paySet() {
      return this.$store.state.paySet;
    },
    typeList() {
      return this.$store.state.bankCard.map((v) => v.ctype);
    },
    Cards() {
      return this.$store.state.bankCard.filter((v) => v.createdAt);
    },
    bankCard() {
      return this.Cards.find((v) => +v.ctype === 2) || {};
    },
    usdtCard() {
      return this.Cards.find((v) => +v.ctype === 3) || {};
    },
  },
  methods: {
    async afterRead(file) {
      const [err] = await userApi.editHeader({
        file: file.file,
      });
      if (err) return;
      await this.sleep(1000);
      this.$store.dispatch("getInfo");
    },
    bindUsdt() {
      if (this.paySet !== 1) {
        this.$toast.fail("请先设置支付密码");
        return this.$router.push("/payPassword");
      }
      this.$router.push("/bindUsdt");
    },
    bindGOpay() {
      if (this.paySet !== 1) {
        this.$toast.fail("请先设置支付密码");
        return this.$router.push("/payPassword");
      }
      this.$router.push("/bindGOpay");
    },
    bindAlipay() {
      if (this.paySet !== 1) {
        this.$toast.fail("请先设置支付密码");
        return this.$router.push("/payPassword");
      }
      this.$router.push("/bindAlipay");
    },
    bindWebchat() {
      if (this.paySet !== 1) {
        this.$toast.fail("请先设置支付密码");
        return this.$router.push("/payPassword");
      }
      this.$router.push("/bindWebchat");
    },
  },
  async created() {
    this.$toast.loading({ duration: 0 });
    this.$store.dispatch("getPaySet");
    await this.$store.dispatch("getBankCard");
    this.$toast.clear();
  },
};
</script>
<style scoped lang="less">
.item-box {
  background: #fff;
  margin-bottom: 20px;

  .item {
    margin-left: 28px;
    padding-top: 28px;
    padding-bottom: 28px;
    padding-right: 28px;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    align-items: center;

    &:last-child {
      border-bottom: none;
    }

    .img {
      width: 96px;
      height: 96px;
      border-radius: 100%;
      margin-right: 24px;
    }

    .left {
      flex: 1;
    }

    .right {
      display: flex;
      align-items: center;

      .arrow-icon {
        font-size: 36px;
        color: #ccc;
      }
    }
  }
}
</style>
