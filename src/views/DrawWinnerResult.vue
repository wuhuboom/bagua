<template>
  <div class="c-page bg-grey">
    <AppTopBar
      topBarTitle="开奖结果"
      :showLeft="false"
      :showRight="false"
    ></AppTopBar>
    <!-- <div class="top-box">
      <div class="t-1">
        <div class="num item">9</div>
        <div class="num item">2</div>
        <div class="num item">3</div>
        <div class="item">亿</div>
        <div class="num item">8</div>
        <div class="num item">9</div>
        <div class="num item">6</div>
        <div class="num item">4</div>
        <div class="item">万</div>
      </div>
      <div class="t-2">平台累计中奖(元)</div>
    </div> -->
    <div class="lists-box">
      <div
        class="lists"
        v-for="(v, i) in list"
        :key="i"
        @click="
          $router.push({
            path: '/winning-list',
            query: {
              id: v.lotteryId,
              lotteryName: v.lotteryName,
            },
          })
        "
      >
        <div class="info">
          <div class="t-1">
            <span class="s-1">{{ v.lotteryName }}</span>
            <span class="s-2"
              >第{{ v.cycleNum }}期
              {{ $dayjsTime(v.openTime, "MM-DD HH:mm:ss") }}</span
            >
          </div>
          <div class="t-2">
            <div class="item on" v-for="(v2, i2) in v.openArr" :key="i2">
              {{ v2 }}
            </div>
          </div>
        </div>
        <van-icon name="arrow" class="icon" color="#E5E5E5" />
      </div>
    </div>
    <AppBtmBar></AppBtmBar>
  </div>
</template>

<script>
import userApi from "@/api/user";
export default {
  name: "DrawWinnerResult",
  data() {
    return {
      list: [],
    };
  },
  methods: {
    async drawWinnerResult() {
      const [err, res] = await userApi.drawWinnerResult();
      if (err) {
        return;
      }
      res.data = res.data.map((v) => {
        v.openArr = v.openNum.split(",");
        return v;
      });
      this.list = res.data;
    },
  },
  created() {
    this.drawWinnerResult();
  },
};
</script>
<style scoped lang="less">
.top-box {
  padding-top: 24px;
  padding-bottom: 20px;
  text-align: center;
  .t-1 {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #bf2935;
    font-size: 40px;
    .num {
      height: 78px;
      background: #fff;
      border-radius: 12px 12px 12px 12px;
      padding: 0 12px;
      font-size: 60px;
      font-weight: bold;
    }
    .item {
      margin-right: 6px;
    }
  }
  .t-2 {
    color: #666666;
    margin-top: 20px;
  }
}
.lists-box {
  padding-left: 28px;
  background: #fff;
  .lists {
    border-bottom: 1px solid #e5e5e5;
    padding: 24px 0;
    display: flex;
    padding-right: 28px;
    align-items: center;
    .info {
      flex: 1;
      .t-1 {
        .s-1 {
          font-size: 30px;
        }
        .s-2 {
          color: #999999;
          font-size: 24px;
          margin-left: 18px;
        }
      }
      .t-2 {
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 60px;
          height: 60px;
          color: #bf2935;
          border-radius: 100%;
          line-height: 60px;
          text-align: center;
          font-size: 40px;
          font-weight: bold;
          margin-right: 20px;
          margin-top: 18px;
          &.on {
            background: #bf2935;
            color: #fff;
          }
        }
      }
    }
    .icon {
      font-size: 28px;
    }
  }
}
</style>
