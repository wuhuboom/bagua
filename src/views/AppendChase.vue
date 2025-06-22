<template>
  <div class="c-page">
    <AppTopBar topBarTitle="自动追期"></AppTopBar>
    <div class="time-box center-center">
      距2024304期截止:
      <van-count-down
        class="time"
        :time="900000000"
        format="DD天HH小时mm分ss秒"
      />
    </div>
    <div class="zq-box center-center">
      追
      <input type="text" class="input" value="5" />
      期
    </div>
    <div class="table-box">
      <div class="row header">
        <div class="col">期数</div>
        <div class="col">倍数</div>
        <div class="col">金额</div>
        <div class="col">预计开奖时间</div>
      </div>
      <div class="row" v-for="i in 10" :key="i">
        <div class="col">第2024304期</div>
        <div class="col">
          <input type="text" class="input" />
        </div>
        <div class="col num">2</div>
        <div class="col">2024-11-13 21:25</div>
      </div>
    </div>
    <div class="bottom-box">
      <div class="height"></div>
      <div class="b-fixed">
        <div class="radio-box center-center">
          <van-radio-group v-model="radio">
            <van-radio name="1" icon-size="16px">中奖后停止追号</van-radio>
          </van-radio-group>
        </div>
        <div class="btn center-center">提交</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppendChase",
  data() {
    return {
      radio: "1",
    };
  },
};
</script>
<style scoped lang="less">
.time-box {
  padding: 14px 0;
  text-align: center;
  font-size: 24px;
  color: #777777;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  .time {
    color: #fc4546;
    font-size: 24px;
    margin-left: 10px;
  }
}
.zq-box {
  height: 94px;
  background: #e8e8e8;
  color: #999999;
  font-weight: 500;
  .input {
    height: 54px;
    width: 146px;
    background: #ffffff;
    border: 1px solid #999999;
    text-align: center;
    margin: 0 32px;
    color: #333;
    font-weight: bold;
  }
}
.table-box {
  padding: 0 30px;
  .row {
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
    border-bottom: 1px solid #efefef;
    font-size: 24px;
    color: #777777;
    padding: 24px 0;
    align-items: center;
    text-align: center;
  }
  .col {
    &:first-child {
      text-align: left;
    }
  }
  .header {
    color: #6a6a6a;
    font-weight: bold;
  }
  .input {
    width: 110px;
    height: 54px;
    text-align: center;
    border: 1px solid #d1d1d1;
    color: #000;
    font-weight: 500;
    font-size: 24px;
  }
  .num {
    color: #be2933;
  }
}
.bottom-box {
  .height {
    height: 260px;
  }
  .b-fixed {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    .radio-box {
      width: 100%;
      padding-top: 28px;
    }
    .btn {
      width: 684px;
      height: 92px;
      background: #be2834;
      margin: 28px auto;
      font-size: 32px;
      font-weight: 500;
      color: #ffffff;
    }
  }
}
</style>
