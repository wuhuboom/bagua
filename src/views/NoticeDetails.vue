<template>
  <div class="c-page">
    <AppTopBar topBarTitle="公告信息"></AppTopBar>
    <div class="details-wrap">
      <div class="top">
        <div class="name">11选5暂停销售</div>
        <div class="time">2017-08-12 12:20:24</div>
      </div>
      <div class="content">
        由于政策原因，悦彩平台暂停销售11选5暂停销售彩票，如有不便请谅解
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoticeDetails",
  data() {
    return {};
  },
};
</script>
<style scoped lang="less">
.details-wrap {
  padding: 0 28px;

  .top {
    border-bottom: 1px solid #e5e5e5;
    padding: 22px 0;
    .name {
      font-size: 32px;
    }
    .time {
      color: #999999;
      font-size: 24px;
      margin-top: 24px;
    }
  }
  .content {
    padding: 28px 0;
    color: #666666;
  }
}
</style>
