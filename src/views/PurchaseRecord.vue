<template>
  <div>
    <AppTopBar class="app-top-bar" topBarTitle="购票记录"> </AppTopBar>
    <ul class="align-center justify-around header">
      <li class="color333">
        <SelectActionSheet
          @select="params.type = $event"
          :id="params.type"
          :actions="types"
        />
      </li>
      <li class="color333">
        <SelectActionSheet
          @select="params.openStatus = $event"
          :id="params.openStatus"
          :actions="navs"
        />
      </li>
      <li class="color333">
        <SelectActionSheet
          @select="params.lotteryId = $event"
          :id="params.lotteryId"
          :actions="sysList"
        />
      </li>
      <li
        class="check center-center color-fff"
        @click="lotteryBetsOrder({ pageNo: 1 })"
      >
        查询
      </li>
    </ul>
    <div>
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
            @click="gotDetails(item)"
          >
            <div class="top">
              <div class="left">
                {{ getName(item.lotteryId) }}（{{ getTxt(item) }}）
              </div>
              <div class="right">第{{ item.expect }}期</div>
            </div>
            <div class="bottom">
              <div class="left">
                <div class="d1 text-ellipsis">
                  投注金额：<span class="on">{{ divide(item.money) }}元</span>
                </div>
                <div class="d2">
                  投注时间： {{ $dayjsTime(item.createdAt) }}
                </div>
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
  </div>
</template>

<script>
import userApi from "@/api/user";
import { mapGetters } from "vuex";
export default {
  name: "PurchaseRecord",
  data() {
    return {
      tabId: -1,
      types: [
        {
          name: "全部记录",
          id: -1,
        },
        {
          name: "自购记录",
          id: 1,
        },
        {
          name: "合买记录",
          id: 2,
        },
        {
          name: "追号记录",
          id: 3,
        },
      ],
      //0未开奖1未中奖2已中奖
      navs: [
        {
          name: "全部状态",
          id: -1,
        },
        {
          name: "未开奖",
          id: 0,
        },
        {
          name: "未中奖",
          id: 1,
        },
        {
          name: "已中奖",
          id: 2,
        },
      ],
      date: [],
      loading: false,
      finished: false,
      params: {
        lotteryId: -1,
        openStatus: -1,
        type: -1,
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
    getTxt(item) {
      // type1 自购 0否1是 /purchase-my-details
      // type2 合买 0否1是 /purchase-record-details
      // type3 追号 0否1是 /purchase-pre-details
      const arr = [];
      if (item.type1 === 1) {
        arr.push("自购");
      }
      if (item.type2 === 1) {
        arr.push("合买");
      }
      if (item.type3 === 1) {
        arr.push("追号");
      }
      return arr.join(",");
    },
    gotDetails(item) {
      // type1 自购 0否1是 /purchase-my-details
      // type2 合买 0否1是 /purchase-record-details
      // type3 追号 0否1是 /purchase-pre-details
      let path = "";
      if (item.type1 === 1) {
        path = "/purchase-my-details";
      } else if (item.type2 === 1) {
        path = "/purchase-record-details";
      } else if (item.type3 === 1) {
        path = "/purchase-pre-details";
      }
      this.$router.push({
        path: path,
        query: { id: item.id },
      });
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
      const [err, res] = await userApi[`lotteryMyOrderAll`](sendData);
      this.$toast.clear();
      this.loading = false;
      if (err) {
        this.finished = true;
        return;
      }
      this.tableData.results = this.tableData.results.concat(res.data.results);
      this.params.pageNo++;
      this.finished = this.params.pageNo > res.data.totalPage;
    },
  },
};
</script>
<style scoped lang="less">
.header {
  height: 96px;
  background-color: #fff;
}
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
.check {
  width: 114px;
  height: 56px;
  background: #bf2834;
  border-radius: 12px 12px 12px 12px;
}
</style>
