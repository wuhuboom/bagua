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
          <div class="col">状态</div>
          <div class="col">金额</div>
          <div class="col">利息</div>
          <div class="col">转入时间</div>
          <div class="col">操作</div>
        </div>
        <div class="row" v-for="(row, index) in tableData.results" :key="index">
          <div class="col">
            {{
              row.status == 0 ? "生息中" : row.status == 1 ? "已转出" : "待转出"
            }}
          </div>
          <div class="col">￥{{ divide(row.money) }}</div>
          <div class="col">
            ￥{{ divide(+row.status === 0 ? row.currIncome : row.outIncome) }}
          </div>
          <div class="col">
            {{ $dayjsTime(row.createdAt, "YYYY/MM/DD") }}
          </div>
          <div class="col">
            <span
              v-if="+row.status !== 1"
              class="active underline"
              @click="$emit('withdrawOne', row)"
              >转出</span
            >
            <span v-else> -- </span>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import userApi from "@/api/user";
export default {
  name: "PromotionCommission",
  data() {
    return {
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
    tabSimpleList() {
      return this.$store.state.tabSimpleList;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    statusType(v) {
      return this.tabSimpleList.find((item) => item.id === v).text;
    },
    selectType() {
      this.$refs.$BtmActionSheet.open();
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
      //删除-1的参数
      for (let key in query) {
        if (query[key] === -1) {
          delete query[key];
        }
      }
      const [err, res] = await userApi.safeList(query);
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
