<template>
  <div>
    <div class="tab-box">
      <!-- on -->
      <div
        class="tab"
        v-for="(item, i) in navs"
        :key="i"
        :class="{ on: item.status === params.status }"
        @click="lotteryBetsOrder({ status: item.status, pageNo: 1 })"
      >
        {{ item.name }}
      </div>
    </div>
    <!-- 没有内容 -->
    <div class="empty-box center-center" v-if="0">
      <div class="img"></div>
      <div class="text">暂无购彩记录，开启您的大奖之旅吧</div>
      <div class="btn center-center">去购彩</div>
    </div>
    <div class="lists-box">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="lotteryBetsOrder"
      >
        <div
          class="lists"
          v-for="(item, i) in results"
          :key="i"
          :class="{
            bonus: +item.openStatus === 2,
          }"
          @click="
            $router.push({
              path: id == 1 ? '/purchase-my-details' : '/purchase-pre-details',
              query: { id: item.id },
            })
          "
        >
          <div class="top">
            <div class="left">{{ getName(item.lotteryId) }}</div>
            <div class="right">第{{ item.expect }}期</div>
          </div>
          <div class="bottom">
            <div class="left">
              <div class="d1 text-ellipsis">
                投注金额：<span class="on">{{ divide(item.money) }}元</span>
              </div>
              <div class="d2">投注时间： {{ $dayjsTime(item.createdAt) }}</div>
            </div>
            <div class="right">
              <div v-if="+item.openStatus === 2" class="num text-ellipsis">
                {{ divide(item.moneyIncome) }}元
              </div>
              <div v-else>
                {{ getOpenStatus(item.openStatus) }}
              </div>
              <van-icon name="arrow" class="arrow" />
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import userApi from "@/api/user";
export default {
  name: "PurchaseRecord",
  data() {
    return {
      tabId: -1,
      navs: [
        {
          name: "全部",
          status: -1,
        },
        {
          name: "待开奖",
          status: 0,
        },
        {
          name: "已开奖", //3 是已结束状态
          status: 3,
        },
      ],
      date: [],
      loading: false,
      finished: false,
      params: {
        lotteryId: -1,
        status: -1,
        pageNo: 1,
        pageSize: 10,
      },
      tableData: {
        totalPage: null,
        totalCount: 0,
        results: [],
      },
    };
  },
  props: {
    id: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    results() {
      return this.tableData.results;
    },
    ...mapGetters(["catList"]),
    apiName() {
      switch (this.id) {
        case 1:
          //自购
          return "lotteryMyOrder";
        case 3:
          //追号
          return "lotteryMyOrderRe";
        default:
          return "lotteryMyOrder";
      }
    },
  },
  methods: {
    getOpenStatus(v) {
      const item = this.$store.state.openStatus.find((d) => d.id === v);
      return item ? item.name : "";
    },
    getName(id) {
      const item = this.catList.find((v) => v.id === id);
      return item ? item.lotteryName : "";
    },
    async lotteryBetsOrder(obj = {}) {
      if (obj.pageNo === 1) {
        this.tableData.results = [];
        window.scrollTo(0, 0);
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
        });
      }
      this.loading = true;
      Object.assign(this.params, obj);
      const sendData = {
        ...this.params,
      };
      // if (Array.isArray(this.date) && this.date.length) {
      //   sendData.start = this.date[0];
      //   sendData.end = this.date[1];
      // }
      //删除-1
      for (let key in sendData) {
        if (sendData[key] === -1) {
          delete sendData[key];
        }
      }
      const [err, res] = await userApi[`${this.apiName}`](sendData);
      this.$toast.clear();
      this.loading = false;
      if (err) {
        this.finished = true;
        return;
      }
      this.tableData.results = this.tableData.results.concat(res.data.results);
      this.params.pageNo++;
      if (this.params.pageNo > res.data.totalPage) {
        this.finished = true;
      }
    },
  },
};
</script>
<style scoped lang="less">
.app-top-bar {
  .right-box {
    color: #fff;
    margin-right: 40px;
    font-size: 26px;
    .arrow {
      font-size: 32px;
      margin-left: 5px;
    }
  }
}
.tab-box {
  display: flex;
  background: #fff;
  justify-content: space-around;
  background-color: #f0f0f0;
  .tab {
    width: 120px;
    height: 88px;
    line-height: 88px;
    text-align: center;
    color: #999999;
    &.on {
      color: #bf2935;

      font-weight: bold;
    }
  }
}
.empty-box {
  flex-direction: column;
  margin: 200px auto;
  .img {
    width: 200px;
    height: 200px;
    background: url("@/assets/img/PurchaseRecord/kong.png") no-repeat;
    background-size: 100% auto;
  }
  .text {
    color: #cccccc;
    margin-top: 50px;
  }
  .btn {
    width: 600px;
    height: 98px;
    background: #bf2935;
    border-radius: 50px 50px 50px 50px;
    color: #fff;
    font-size: 32px;
    color: #ffffff;
    margin-top: 180px;
  }
}
.lists-box {
  .lists {
    background: #fff;
    margin-top: 20px;
    position: relative;
    &.bonus {
      &::after {
        content: "";
        position: absolute;
        right: 0;
        top: 50%;
        width: 120px;
        height: 120px;
        background: url("@/assets/img/PurchaseRecord/Group.png") no-repeat;
        background-size: 100% auto;
        margin-top: -60px;
      }
    }
    .top {
      border-bottom: 1px solid #e5e5e5;
      padding: 30px 32px;
      display: flex;
      align-items: center;
      .left {
        flex: 1;
      }
      .right {
        font-size: 26px;
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      padding: 24px 28px;
      .left {
        flex: 1;
        .d1 {
          max-width: 400px;
          .on {
            color: #bf2935;
          }
        }
        .d2 {
          color: #999999;
          font-size: 24px;
          margin-top: 2px;
        }
      }
      .right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .arrow {
          font-size: 32px;
          color: #999999;
          margin-left: 10px;
        }
        .num {
          color: #bf2935;
          max-width: 300px;
        }
      }
    }
  }
}
</style>
