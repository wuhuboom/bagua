<template>
  <div>
    <!-- <div class="p-t-24 p-b-24 m-t-16" v-if="tab !== 4">
      <van-form
        @submit="
          lotteryBetsOrder({
            pageNo: 1,
          })
        "
        class="align-center serach-form"
      >
        <van-field
          class="m-l-24 m-r-24"
          v-model.trim="params.orderId"
          name="playerName"
          placeholder="方案编号"
        />
        <van-button
          class="no-grow no-shrink m-r-24"
          type="info"
          native-type="submit"
          >提交</van-button
        >
      </van-form>
    </div> -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="lotteryBetsOrder"
    >
      <div class="table-lists">
        <div class="row hearder">
          <div class="col">用户</div>
          <div class="col">认购金额</div>
          <div class="col">订单金额</div>
          <div class="col">认购时间</div>
          <div class="col">状态</div>
        </div>
        <div class="row" v-for="(row, index) in tableData.results" :key="index">
          <div class="col els">{{ row.username }}</div>
          <div class="col els">{{ divide(row.money) }}</div>
          <div class="col">{{ divide(row.orderMoney) }}</div>
          <div class="col">{{ $dayjsTime(row.createdAt, "YYYY/MM/DD") }}</div>
          <div class="col">{{ statusType(row.status) }}</div>
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
        orderId: "",
        pageNo: 1,
        pageSize: 25,
      },
    };
  },
  props: {
    id: {
      type: Number,
      default: 0,
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
    //"status": 状态 0待开奖 1已中 2未中,
    statusType(status) {
      switch (status) {
        case 0:
          return "待开奖";
        case 1:
          return "已中";
        case 2:
          return "未中";
      }
    },
    onSelect(item) {
      console.log(item);
      // this.params.begin = item.id;
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
        id: this.id,
      };
      const [err, res] = await userApi.groupBets(query);
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
.serach-form {
  ::v-deep {
    .van-field {
      background: #f7f7f7;
      border-radius: 12px 12px 12px 12px;
      border: 2px solid #c9c9c9;
      height: 58px;
      padding: 0 24px;
      [type="text"] {
        height: 54px;
      }
    }
  }
  [type="submit"] {
    width: 120px;
    height: 58px;
    background: #bf2834;
    border-radius: 12px 12px 12px 12px;
    border: none;
  }
}
</style>
