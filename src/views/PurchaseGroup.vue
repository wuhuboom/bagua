<template>
  <div>
    <ul class="tab-box justify-between p-l-48 p-r-48 align-center">
      <li @click="openSheet">
        {{ curCat?.name }}<van-icon class="m-l-8" name="arrow-down" />
      </li>
      <li
        class="check center-center color-fff"
        @click="lotteryBetsOrder({ pageNo: 1 })"
      >
        查询
      </li>
    </ul>
    <BtmActionSheet @select="select" :actions="sysList" ref="$BtmActionSheet" />
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
          class="lists font12 color777"
          v-for="(item, i) in results"
          :key="i"
          @click="
            $router.push({
              path: '/purchase-record-details',
              query: { id: item.id },
            })
          "
        >
          <div class="top p-l-24 p-r-24">
            <div class="left align-center els m-r-8">
              <span class="active font14">{{ getName(item.lotteryId) }}</span>
              <span class="m-l-16 els">单号{{ item.orderId }}</span>
            </div>
            <div class="right active m-l-16">
              {{ getOpenStatus(item.openStatus) }}
            </div>
          </div>
          <ul class="say align-center">
            <li class="align-center p-l-24">
              <p class="els">发起人:{{ item.playerName }}</p>
            </li>
            <li class="center-center">
              <p class="els">进度:{{ item.p }}%</p>
            </li>
            <li class="center-center">
              <p class="els color333 underline">{{ getStatus(item.status) }}</p>
            </li>
          </ul>
          <ul class="say align-center b-m-n">
            <li class="align-center p-l-24">
              <p class="els">
                认购:
                <span class="color333">{{ divide(item.myBetCount) }}</span>
              </p>
            </li>
            <li class="center-center">
              <p class="els">
                奖金:
                <span class="color333">{{ divide(item.myMoneyIncome) }}</span>
              </p>
            </li>
            <li class="center-center">
              <p class="els">
                {{ $dayjsTime(item.createdAt, "MM-DD HH:mm:ss") }}
              </p>
            </li>
          </ul>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/user";
import { mapGetters } from "vuex";
export default {
  name: "PurchaseRecord",
  data() {
    return {
      id: +this.$route.query.id,
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
  computed: {
    results() {
      return this.tableData.results;
    },
    ...mapGetters(["catList"]),
    curCat() {
      return this.sysList.find((v) => v.id === this.params.lotteryId);
    },
    sysList() {
      const arr = [
        {
          lotteryName: "全部游戏",
          id: -1,
        },
      ];
      this.$store.state.cat.forEach((item) => {
        arr.push(...item.list);
      });
      return arr.map((v) => {
        return {
          name: v.lotteryName,
          id: v.id,
        };
      });
    },
    apiName() {
      switch (this.id) {
        case 1:
          return "lotteryMyOrder";
        case 2:
          return "lotteryMyOrderTogether";
        case 3:
          return "lotteryMyOrderRe";
        default:
          return "lotteryMyOrder";
      }
    },
  },
  methods: {
    copy(v) {
      navigator.clipboard.writeText(v).then(() => {
        this.$toast("复制成功");
      });
    },
    openSheet() {
      this.$refs.$BtmActionSheet.open();
    },
    select(item) {
      this.params.lotteryId = item.id;
    },
    getStatus(v) {
      return (this.$store.state.status.find((doc) => +doc.id === +v) || {})
        .name;
    },
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
      const [err, res] = await userApi[`lotteryMyOrderTogether`](sendData);
      this.$toast.clear();
      this.loading = false;
      if (err) {
        this.finished = true;
        return;
      }
      res.data.results.forEach((v) => {
        const curMoney = v.betCountCurr / 100;
        const fix = (curMoney / v.betTotal).toFixed(2);
        v.p = parseInt(fix * 100);
        v.clientMoney = "";
        //剩余
        v.sellCount = v.betTotal - curMoney;
      });
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
  height: 98px;
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
    margin: 20px 30px 0;
    position: relative;
    background: #ffffff;
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #e0e1e0;
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
.check {
  width: 114px;
  height: 56px;
  background: #bf2834;
  border-radius: 12px 12px 12px 12px;
}
.b-m-n {
  border: none !important;
}
.say {
  height: 88px;
  border-bottom: 1px solid #e0e1e0;
  & > li {
    width: 33.333%;
    height: 100%;
  }
  & > li:nth-child(2) {
    border-left: 1px solid #e0e1e0;
    border-right: 1px solid #e0e1e0;
  }
}
.underline {
  text-decoration: underline;
}
</style>
