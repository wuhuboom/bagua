<template>
  <div class="c-page bg-grey">
    <AppTopBar class="app-top-bar" topBarTitle="资金明细">
      <template v-slot:right>
        <div class="right-box" @click="selectType">
          {{ curTime.name }}
          <van-icon name="arrow-down" class="arrow" />
        </div>
      </template>
    </AppTopBar>
    <div class="info-box">
      <div class="num m-r-16 align-center">
        <template v-if="showBalance">
          <div class="m-r-16 align-center">
            <p class="balance">{{ divide(user.balance) }}</p>
          </div>
        </template>
        <template v-else> ****** </template>
        <div :class="!showBalance ? 'controlEye' : ''">
          <i
            class="icon iconfont font18 my-show"
            @click.stop="showBalance = !showBalance"
            :class="[
              showBalance ? 'icon-yanjing_xianshi_o' : 'icon-yanjing_yincang_o',
            ]"
          ></i>
        </div>
      </div>
      <div class="text">账户余额(元)</div>
    </div>
    <!-- 没有内容 -->
    <div class="empty-box center-center" v-if="0">
      <div class="img"></div>
      <div class="text">您暂无账目明细记录</div>
    </div>
    <div class="pay-list">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="lotteryBetsOrder"
      >
        <div class="list" v-for="(row, index) in results" :key="index">
          <div class="left">
            <!-- <div class="img" :class="[list.type]"></div> -->
            <div class="n-box">
              <div class="name">{{ statusType(row.balanceChangeType) }}</div>
              <div class="time">{{ $dayjsTime(row.createdAt) }}</div>
            </div>
          </div>
          <div class="right">
            <div class="num">
              <!-- :class="{
                fu: list.num.includes('-'),
              }" -->
              {{ divide(row.changeMoney) }}
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <!-- <van-action-sheet
      v-model="selectShow"
      :actions="selectActions"
      cancel-text="取消"
      close-on-click-action
    /> -->
    <BtmActionSheet
      @select="onSelect"
      :actions="selectActions"
      ref="$BtmActionSheet"
    />
  </div>
</template>

<script>
import userApi from "@/api/user";
import dayjs from "dayjs";
export default {
  name: "FinancialDetails",
  data() {
    return {
      loading: false,
      finished: false,
      selectShow: false,
      selectActions: [
        {
          name: "近一周",
          id: "",
        },
        {
          name: "近一月",
          id: "",
        },
        {
          name: "近三月",
          id: "",
        },
      ],
      payLists: [
        {
          name: "支付宝充值",
          time: "2017-08-13 23:30:30",
          num: "+10.00",
          type: "zhifubao",
        },
        {
          name: "银行卡充值",
          time: "2017-08-13 23:30:30",
          num: "+10.00",
          type: "yinhangka",
        },
      ],
      params: {
        begin: "",
        orderId: "",
        type: "",
        status: "",
        pageNo: 1,
        pageSize: 25,
      },
      tableData: {
        totalCount: 0,
        results: [],
      },
      showBalance: false,
    };
  },
  computed: {
    curTime() {
      return this.selectActions.find((item) => item.id === this.params.begin);
    },
    user() {
      return this.$store.state.user;
    },
    results() {
      return this.tableData.results;
    },
    tabSimpleList() {
      return this.$store.state.tabSimpleList;
    },
  },
  methods: {
    onSelect(item) {
      this.params.begin = item.id;
      this.lotteryBetsOrder({ pageNo: 1 });
    },
    statusType(type) {
      return this.tabSimpleList.find((item) => +item.id === +type)?.text;
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
      const query = {
        ...this.params,
      };
      const [err, res] = await userApi.balanceChangeReq(query);
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
    selectType() {
      this.$refs.$BtmActionSheet.open();
    },
    calculateDates() {
      const today = dayjs();
      const lastWeek = today.subtract(7, "day").format("YYYY-MM-DD");
      const lastMonth = today.subtract(1, "month").format("YYYY-MM-DD");
      const lastThreeMonths = today.subtract(3, "month").format("YYYY-MM-DD");
      this.selectActions = [
        {
          name: "近一周",
          id: lastWeek,
        },
        {
          name: "近一月",
          id: lastMonth,
        },
        {
          name: "近三月",
          id: lastThreeMonths,
        },
      ];
      this.params.begin = lastWeek;
    },
  },
  created() {
    this.calculateDates();
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

.info-box {
  padding: 42px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .num {
    color: #bf2935;
    font-size: 60px;
    font-weight: bold;
  }

  .text {
    color: #666666;
    margin-top: 6px;
  }
}

.pay-list {
  .list {
    background: #fff;
    display: flex;
    padding: 24px 28px;
    align-items: center;
    margin-bottom: 20px;

    .left {
      display: flex;
      align-items: center;

      .img {
        height: 80px;
        width: 80px;
        margin-right: 14px;
        background-repeat: no-repeat;
        background-size: 100% auto;

        &.fanhuan {
          background-image: url("@/assets/img/FinancialDetails/fanhuan.png");
        }

        &.shibai {
          background-image: url("@/assets/img/FinancialDetails/shibai.png");
        }

        &.weixin {
          background-image: url("@/assets/img/FinancialDetails/weixin.png");
        }

        &.yinhangka {
          background-image: url("@/assets/img/FinancialDetails/yinhangka.png");
        }

        &.zhifubao {
          background-image: url("@/assets/img/FinancialDetails/zhifubao.png");
        }
      }

      .n-box {
        .name {
          font-size: 30px;
        }

        .time {
          font-size: 24px;
          color: #999999;
          margin-top: 4px;
        }
      }
    }

    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .num {
        font-size: 32px;
        color: #bf2935;

        &.fu {
          color: #000000;
        }
      }

      .arrow {
        font-size: 32px;
        margin-left: 6px;
        color: #999999;
      }
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
}

.my-show {
  font-size: 40px;
}

.controlEye {
  display: flex;
  margin-top: -20px;
}
</style>
