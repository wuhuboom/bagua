<template>
  <div class="c-page bg-grey">
    <AppTopBar topBarTitle="福彩3D"></AppTopBar>
    <div class="before-lottery">
      <div class="header lists">
        <div class="left text-ellipsis">期号</div>
        <div class="right text-ellipsis">
          <div class="num-box">
            <div class="num">开奖号</div>
          </div>
          <div class="time">开奖时间</div>
        </div>
      </div>
      <div>
        <div class="lists" v-for="i in 20" :key="i">
          <div class="left text-ellipsis">第2017093期</div>
          <div class="right text-ellipsis">
            <div class="num-box">
              <div class="num">1</div>
              <div class="num">7</div>
              <div class="num">3</div>
            </div>
            <div class="time">2024-11-12 21:15</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DrawWinner",
  data() {
    return {};
  },
};
</script>
<style scoped lang="less">
.before-lottery {
  .lists {
    display: flex;
    height: 64px;
    background: #fff;
    padding: 0 52px;
    line-height: 64px;
    font-size: 24px;
    color: #666666;
    &:nth-child(2n) {
      background: #f9f9f9;
    }
    &.header {
      background: #e5e5e5;
      .num-box {
        color: #666;
        font-weight: 400;
        font-size: 24px;
        .num {
          width: 150px;
        }
      }
    }
  }
  .left {
    width: 150px;
    text-align: center;
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: end;
    .num-box {
      margin-right: 80px;
      color: #bf2935;
      font-size: 36px;
      font-weight: 600;
      display: flex;
      .num {
        width: 50px;
        text-align: center;
      }
    }
    .time {
      width: 200px;
      text-align: center;
    }
  }
}
</style>
