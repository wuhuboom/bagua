<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="邀请好友"></AppTopBar>
    <div class="i-main">
      <div class="title">邀请码</div>
      <div class="l-box">
        <div class="left">{{ `${myLink}` }}</div>
        <div
          class="right center-center"
          v-clipboard:copy="copy(`官网地址:${sites}\n邀请码:${myLink}`)"
          v-clipboard:success="onCopySuccess"
        >
          复制邀请码
        </div>
      </div>
      <div class="title">官网地址</div>
      <div class="l-box">
        <div class="left">{{ `${sites}` }}</div>
        <div
          class="right center-center"
          v-clipboard:copy="copy(`${sites}`)"
          v-clipboard:success="onCopySuccess"
        >
          复制地址
        </div>
      </div>
      <div class="text">
        你可以将以上地址通过QQ、MSN、微博、邮件等⽅式发给您的好友
      </div>
      <p class="m-t-48" style="color: #c33743">
        通过个人推广邀请码的注册的会员可获得团队成员每笔充值的3%推广奖励
      </p>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/user";
export default {
  name: "InviteFriends",
  data() {
    return {
      headData: {
        //website:官方 website2:推广链接 point:返点 month:本月返点 lastMonth:上月返点
      },
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    sites() {
      return this.headData.website;
    },
    myLink() {
      return this.user.invitationCode;
    },
  },
  methods: {
    async mysub2() {
      const [err, res] = await userApi.mysub2();
      if (err) return;
      this.headData = res.data;
    },
    copy(v) {
      return v;
    },
    onCopySuccess() {
      this.$toast("复制成功");
    },
  },
  created() {
    this.mysub2();
  },
};
</script>
<style scoped lang="less">
.i-main {
  padding: 28px;
  .title {
    font-size: 36px;
    font-weight: 500;
    padding-bottom: 40px;
    border-bottom: 1px solid #ccc;
  }
  .l-box {
    padding-top: 40px;
    padding-bottom: 80px;
    display: flex;
    align-items: center;
    .left {
      flex: 1;
      color: #3e4cde;
      width: 500px;
      word-break: break-all;
      margin-right: 50px;
    }
    .right {
      color: #be2834;
      font-weight: 500;
      width: 210px;
      height: 58px;
      border: 4px solid #c33743;
    }
  }
  .text {
    font-size: 24px;
    color: #a2a2a2;
  }
}
</style>
