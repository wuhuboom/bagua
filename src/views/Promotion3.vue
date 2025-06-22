<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="lotteryBetsOrder"
    >
      <div class="table-lists">
        <div class="row hearder">
          <div class="col">用户</div>
          <div class="col">余额</div>
          <div class="col">投注任务</div>
          <div class="col">状态</div>
          <div class="col">详情</div>
        </div>
        <div class="row" v-for="(row, index) in tableData.results" :key="index">
          <div class="col els">{{ row.username }}</div>
          <div class="col els">{{ divide(row.balance) }}</div>
          <div class="col">{{ divide(row.taskAim) }}</div>
          <div class="col">{{ +row.status ? "正常" : "禁" }}</div>
          <div class="col">
            <p class="underline" @click="goDetail(row)">查看</p>
          </div>
        </div>
      </div>
    </van-list>
    <BtmActionSheet
      @select="onSelect"
      :actions="selectActions"
      ref="$BtmActionSheet"
    />
  </div>
</template>

<script>
import dayjs from "dayjs";
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
export default {
  name: "PromotionCommission",
  data() {
    return {
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
      loading: false,
      finished: false,
      tableData: {
        totalCount: 0,
        results: [],
      },
      params: {
        playerName: "",
        pageNo: 1,
        pageSize: 25,
      },
    };
  },
  props: {
    begin: {
      type: String,
      default: "",
    },
  },
  computed: {
    curTime() {
      return (
        this.selectActions.find((item) => item.id === this.params.begin) || {}
      );
    },
  },
  methods: {
    goDetail(row) {
      this.$router.push({
        path: "/promotion-team",
        query: {
          id: row.id,
        },
      });
    },
    statusType(type) {
      switch (type) {
        case 1:
          return "待付款";
        case 2:
          return "已到账";
        case 3:
          return "已上分";
        case 4:
          return "支付超时";
        default:
          return "";
      }
    },
    onSelect(item) {
      console.log(item);
      // this.params.begin = item.id;
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
      delete query.begin;
      const [err, res] = await userApi.groupMember(query);
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
  }
}
.table-lists {
  .hearder {
    background: #f0f0f0;
    color: #333 !important;
    margin: 0 !important;
    padding: 0 30px;
  }
  .row {
    display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
    color: #777777;
    border-bottom: 1px solid #eaeaea;
    margin: 0 30px;
    align-items: center;
  }
  .col {
    padding: 24px 0;
    text-align: center;
  }
}
.bottom-btn {
  .height {
    height: 126px;
  }
  .btn {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 126px;
    line-height: 126px;
    background: #ffe7e9;
    padding: 0 34px;
    font-size: 30px;
  }
}
</style>
