<template>
  <div class="c-page">
    <AppTopBar topBarTitle="我的关注"></AppTopBar>
    <div class="lists-box">
      <div class="lists" v-for="i in 10" :key="i">
        <div class="left">
          <img src="" class="img" />
          <div class="name">cr必红</div>
        </div>
        <div class="right">已关注</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyFollow",
  data() {
    return {};
  },
};
</script>
<style scoped lang="less">
.lists-box {
  padding-left: 44px;
  padding-right: 34px;
  .lists {
    display: flex;
    border-bottom: 1px solid #efefef;
    padding: 26px 0;
    align-items: center;
    .left {
      flex: 1;
      margin-right: 40px;
      display: flex;
      align-items: center;
      .name {
        font-size: 32px;
        margin-left: 20px;
      }
      .img {
        width: 100px;
        height: 100px;
        border-radius: 100%;
      }
    }
    .right {
      height: 54px;
      color: #fff;
      background: #ff8848;
      line-height: 54px;
      padding: 0 14px;
    }
  }
}
</style>
