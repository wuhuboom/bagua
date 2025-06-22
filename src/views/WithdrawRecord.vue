<template>
  <div class="c-page bg-grey">
    <AppTopBar class="app-top-bar" topBarTitle="提现记录">
      <template v-slot:right>
        <!-- <div class="right-box" @click="selectType">
          {{ curTime.name }}
          <van-icon name="arrow-down" class="arrow" />
        </div> -->
      </template>
    </AppTopBar>
    <!-- <div class="info-box">
      <div class="num">{{ divide(user.balance) }}</div>
      <div class="text">账户余额(元)</div>
    </div> -->
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
        <div class="list-row" v-for="(row, index) in results" :key="index">
          <div class="list">
            <div class="left flex-1">
              <!-- <div class="img" :class="[list.type]"></div> -->
              <div class="n-box">
                <div class="name">{{ getType(+row.type) }}</div>
                <div class="time">{{ $dayjsTime(row.createdAt) }}</div>
              </div>
            </div>
            <div class="right flex-column" style="text-align: right">
              <div class="name">
                {{ getState(+row.status) }}
              </div>
              <div class="num">
                {{ divide(row.money) }}
              </div>
            </div>
          </div>
          <p
            class="mark p-t-16 active"
            style="text-align: right"
            v-if="row.remark"
          >
            {{ row.remark }}
          </p>
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
      typeList: [
        //0支付宝1微信2.银行卡,3.USDT
        {
          nameStr: "支付宝",
          valueNum: 0,
        },
        {
          nameStr: "微信",
          valueNum: 1,
        },
        {
          nameStr: "银行卡",
          valueNum: 2,
        },
        {
          nameStr: "USDT",
          valueNum: 3,
        },
        {
          nameStr: "GOpay",
          valueNum: 4,
        },
      ],
      statusList: [
        {
          nameStr: this.$t("withdraw.record.status.need.audit.text"),
          valueNum: 1,
        },
        {
          nameStr: this.$t("withdraw.record.status.already.audit.text"),
          valueNum: 2,
        },
        {
          nameStr: this.$t("withdraw.failed"),
          valueNum: 3,
        },
        {
          nameStr: this.$t("withdraw.record.status.withdraw.success.text"),
          valueNum: 4,
        },
        {
          nameStr: this.$t("withdraw.record.status.paid.in.text"),
          valueNum: 5,
        },
        {
          nameStr: this.$t("backapi.self.pay.failed.text"),
          valueNum: 6,
        },
        {
          nameStr: this.$t("withdraw.record.status.operation.in.text"),
          valueNum: 7,
        },
        {
          nameStr: this.$t("withdraw.record.status.redo.in.text"),
          valueNum: 8,
        },
        {
          nameStr: this.$t("backapi.self.pay.failed.text"),
          valueNum: 9,
        },
      ],
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
    getType(value) {
      if (value) {
        let res = this.typeList.find((item) => item.valueNum === value);
        return res.nameStr;
      }
      return "--";
    },
    getState(value) {
      const res = this.statusList.find((item) => item.valueNum === value);
      if (res) {
        return res.nameStr;
      }
      return "--";
    },
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
      const [err, res] = await userApi.withdrawLogReq(query);
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
  .list-row {
    background: #fff;
    padding: 24px 28px;
    margin-bottom: 20px;
  }

  .list {
    display: flex;
    align-items: center;

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

.green {
  color: #3291ff;
}

.red {
  color: #f82354;
}
</style>
