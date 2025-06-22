<template>
  <div class="c-page bg-grey">
    <AppTopBar :topBarTitle="lotteryName"></AppTopBar>
    <div class="lists-wrap">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="lotteryBetsOrder"
      >
        <div class="lists" v-for="(v, i) in tableData.results" :key="i">
          <div class="left">
            <div class="time">
              第{{ v.cycleNum }}期
              {{ $dayjsTime(v.openTime, "MM-DD HH:mm:ss") }}
            </div>
            <div class="info">
              <div
                class="item center-center on"
                v-for="(v2, i2) in v.openArr"
                :key="i2"
              >
                {{ v2 }}
              </div>
            </div>
          </div>
          <ul class="housan align-center font12">
            <li>
              <p>后三</p>
              <p class="center-center blur-bg">
                {{ getGroup(+v.type) }}
              </p>
            </li>
            <li>
              <p>十位</p>
              <p>{{ calculateDxDs(v.openArr[v.openArr.length - 2]) }}</p>
            </li>
            <li>
              <p>个位</p>
              <p>{{ calculateDxDs(v.openArr[v.openArr.length - 1]) }}</p>
            </li>
          </ul>
        </div>
      </van-list>
    </div>
    <div class="buy-box">
      <div class="height"></div>
      <div
        class="btn center-center"
        @click="
          $router.push({
            path: '/game/hall',
            query: {
              id: params.id,
              type: cur.lotteryType,
            },
          })
        "
      >
        去购彩
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import userApi from "@/api/user";
export default {
  name: "WinningList",
  data() {
    return {
      loading: false,
      finished: false,
      tableData: {
        totalCount: 0,
        results: [],
      },
      lotteryName: this.$route.query.lotteryName,
      params: {
        id: +this.$route.query.id,
        pageNo: 1,
        pageSize: 25,
      },
    };
  },
  computed: {
    ...mapGetters(["catList"]),
    cur() {
      return this.catList.find((v) => v.id === this.params.id) || {};
    },
  },
  methods: {
    calculateDxDs(number) {
      if (number < 0 || number > 9) {
        return "请输入 0-9 的数字！";
      }

      // 判断大小
      const size = number >= 5 ? "大" : "小";

      // 判断单双
      const parity = number % 2 === 0 ? "双" : "单";

      // 返回结果
      return `${size}${parity}`;
    },
    getGroup(type) {
      // type 1豹子 2组三 3组六
      switch (type) {
        case 1:
          return "豹子";
        case 2:
          return "组三";
        case 3:
          return "组六";
        default:
          return "";
      }
    },
    async lotteryBetsOrder(obj = {}) {
      this.loading = true;
      Object.assign(this.params, obj);
      const query = {
        ...this.params,
      };
      const [err, res] = await userApi.lotteryHisExpect(query);
      this.loading = false;
      if (err) {
        this.finished = true;
        return;
      }
      res.data.results = res.data.results.map((v) => {
        v.openArr = v.openNum.split(",");
        return v;
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
.lists-wrap {
  color: #333;
  padding-left: 28px;
  .lists {
    border-bottom: 1px solid #e5e5e5;
    padding: 24px 0;
    padding-right: 24px;
    display: flex;
    align-items: center;

    &:last-child {
      border-bottom: none;
    }
    .left {
      flex: 1;
      .info {
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 60px;
          height: 60px;
          font-size: 40px;
          color: #bf2935;
          border-radius: 100%;
          margin-right: 20px;
          margin-top: 20px;
          &.on {
            background: #bf2935;
            color: #fff;
          }
        }
      }
    }
    .right {
      font-size: 32px;
    }
  }
}
.buy-box {
  .height {
    height: 98px;
  }
  .btn {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #bf2935;
    height: 98px;
    color: #fff;
    font-size: 32px;
  }
}
.housan {
  & > li {
    margin-left: 38px;
    height: 120px;

    & > p:last-child {
      margin-top: 20px;
      color: #000;
    }
    .blur-bg {
      width: 76px;
      color: #fff !important;
      height: 50px;
      background: #0091ff;
      border-radius: 16px 16px 16px 16px;
    }
  }
  & > li:first-child {
    margin-left: 0;
  }
}
</style>
