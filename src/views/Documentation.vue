<template>
  <div class="c-page bg-grey">
    <AppTopBar class="app-top-bar" topBarTitle="合买大厅">
      <!-- <template v-slot:right>
        <div class="right-box" @click="$tool.goPage('/buy-together')">
          发起合买
        </div>
      </template> -->
    </AppTopBar>
    <BtmActionSheet @select="select" :actions="sysList" ref="$BtmActionSheet" />
    <ul class="align-center justify-between p-l-24 p-r-24 header">
      <li>
        <input
          type="text"
          placeholder="输入发起人"
          v-model.trim="params.playerName"
        />
      </li>
      <li class="center-center">
        <p @click="openSheet">
          {{ curLottery.lotteryName }}
          <van-icon class="m-l-8" name="arrow-down" />
        </p>
      </li>
      <li
        class="check center-center color-fff"
        @click="lotteryBetsOrder({ pageNo: 1 })"
      >
        查询
      </li>
    </ul>
    <div class="p-x-24">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="lotteryBetsOrder"
      >
        <div
          class="justify-between results-list-docs p-t-24 p-r-24 p-b-24 m-b-16"
          v-for="(item, i) in results"
          :key="i"
          @click="
            $router.push({
              path: '/purchase-record-details',
              query: { id: item.id },
            })
          "
        >
          <div class="flex-column center-center no-shrink circle-pro">
            <div class="m-b-16 blod font13">{{ item.lotteryName }}</div>
            <van-circle
              :rate="item.p"
              :stroke-width="60"
              :text="item.p + '%'"
              :size="46"
              layer-color="#f6b426"
              color="#ff3b55"
              :speed="100"
              v-model="item.currentRate"
            />
          </div>
          <div class="flex-1 font12">
            <ul>
              <li class="justify-between p-b-16 m-b-16 name-line">
                <p class="playerName align-center">
                  <img
                    class="d-img my-pic"
                    src="@/assets/img/icons-ue.png"
                    alt=""
                  />
                  {{ item.playerName?.replace(/^(.{2}).*/, "$1***") }}
                </p>
                <p class="detail-txt">详情</p>
              </li>
              <li>
                <div class="justify-between">
                  <div class="flex-column">
                    <p class="m-b-8 color999">总金额</p>
                    <p class="blod">{{ divide(item.money) }}元</p>
                  </div>
                  <div class="flex-column center-center">
                    <p class="m-b-8 color999">剩余</p>
                    <p class="blod">{{ item.sellCount }}元</p>
                  </div>
                  <template v-if="item.sellCount && +item.status === 0">
                    <div class="flex-column center-center">
                      <p class="buy-btn center-center">跟一单</p>
                    </div>
                  </template>
                  <template v-else>
                    <div class="flex-column" style="text-align: right">
                      <p class="m-b-8 color999">状态</p>
                      <!-- {{ getStatus(item.status) }} -->
                      <p class="blod">已结束</p>
                    </div>
                  </template>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!-- <div
          class="dashen-box m-b-24"
          v-for="(item, i) in results"
          :key="i"
          @click="
            $router.push({
              path: '/purchase-record-details',
              query: { id: item.id },
            })
          "
        >
          <ul class="p-r-24 p-l-12 p-t-24 p-b-24 flex-column">
            <li class="justify-between align-center">
              <div>
                <p class="active font16 m-b-24">{{ item.lotteryName }}</p>
                <p class="color333">发起人：{{ item.playerName }}</p>
              </div>
              <p
                class="buy center-center color-fff"
                v-if="item.sellCount && +item.status === 0"
              >
                跟一单
              </p>
              <p class="status center-center" v-else>
                {{ getStatus(item.status) }}
              </p>
            </li>
            <li class="align-center b-t-m p-l-12">
              <p class="color777 align-center m-r-80">
                金额
                <span class="m-l-8 m-r-8 color333 bold">{{
                  divide(item.money)
                }}</span
                >元
              </p>
              <p class="color777 align-center m-r-80">
                剩余
                <span class="m-l-8 m-r-8 color333 bold">{{
                  item.sellCount
                }}</span
                >元
              </p>
            </li>
          </ul>
        </div> -->
      </van-list>
    </div>

    <AppBtmBar></AppBtmBar>
  </div>
</template>

<script>
import userApi from "@/api/user";
const initForm = () => ({
  ftype: -1,
  playerName: "",
  lotteryId: "",
  betCountMin: -1,
  pageNo: 1,
  pageSize: 10,
});
export default {
  name: "AppDocumentation",
  data() {
    return {
      loading: false,
      finished: false,
      params: initForm(),
      tableData: {
        totalPage: null,
        totalCount: 0,
        results: [],
      },
      currentRate: 80,
      fromRoute: null, // 存储前一个路由
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.fromRoute = from; // 只能在 next() 里访问 this
    });
  },
  computed: {
    text() {
      return this.currentRate.toFixed(0) + "%";
    },
    results() {
      return this.tableData.results;
    },
    curLottery() {
      return this.catList.find((v) => v.id === this.params.lotteryId);
    },
    sysList() {
      const arr = [
        {
          lotteryName: "全部游戏",
          id: "",
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
    catList() {
      const arr = [
        {
          lotteryName: "全部游戏",
          id: "",
        },
      ];
      this.$store.state.cat.forEach((item) => {
        arr.push(...item.list);
      });
      return arr;
    },
  },
  methods: {
    btmStatus(v) {
      return (this.$store.state.btmStatus.find((doc) => +doc.id === +v) || {})
        .name;
    },
    getStatus(v) {
      return (this.$store.state.status.find((doc) => doc.id === v) || {}).name;
    },
    openSheet() {
      this.$refs.$BtmActionSheet.open();
    },
    select(item) {
      this.params.lotteryId = item.id;
    },
    async lotteryBetsOrder(obj = {}) {
      if (obj.pageNo === 1) {
        this.tableData.results = [];
        this.$toast.loading({
          forbidClick: true,
        });
        window.scrollTo(0, 0);
      }
      this.loading = true;
      Object.assign(this.params, obj);
      const sendData = {
        ...this.params,
      };
      for (let key in sendData) {
        if (sendData[key] === "" || sendData[key] === -1) {
          delete sendData[key];
        }
      }
      const [err, res] = await userApi.lotteryBetsOrder(sendData);
      this.$toast.clear();
      this.loading = false;
      if (err) {
        this.finished = true;
        return;
      }
      res.data.results.forEach((v) => {
        v.betCountCurr = v.betCountCurr / 100;
        v.betTotal = v.betTotal / 100;
        const curMoney = v.betCountCurr;
        const fix = (curMoney / v.betTotal).toFixed(2);
        v.p = parseInt(fix * 100);
        v.clientMoney = "";
        v.currentRate = 0;
        //剩余
        v.sellCount = v.betTotal - curMoney;
      });
      this.params.pageNo++;
      if (this.params.pageNo > res.data.totalPage) {
        this.finished = true;
      }
      this.tableData.results = this.tableData.results.concat(res.data.results);
    },
  },
  activated() {
    if (this.fromRoute?.path == "/purchase-record-details") return;
    this.lotteryBetsOrder(initForm());
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
.header {
  height: 90px;
  background: #ffffff;
  [type="text"] {
    padding: 0 16px;
    width: 214px;
    height: 58px;
    background: #f7f7f7;
    border-radius: 12px 12px 12px 12px;
    border: 2px solid #c9c9c9;
  }
  .check {
    width: 114px;
    height: 56px;
    background: #bf2834;
    border-radius: 12px 12px 12px 12px;
  }
}
.dashen-box {
  height: 238px;
  background: #bf2834;
  border-radius: 20px 20px 20px 20px;
  padding-left: 16px;
  & > ul {
    background-color: #fff;
    height: 100%;
    justify-content: space-between;
  }
  .buy {
    width: 148px;
    height: 58px;
    background: #bf2935;
    border-radius: 4px 4px 4px 4px;
  }
  .status {
    width: 148px;
    height: 58px;
    border-radius: 4px 4px 4px 4px;
  }
  .b-t-m {
    height: 68px;
    background: #f6fafb;
  }
}
.results-list-docs {
  background-color: #fff;
  .circle-pro {
    width: 162px;
    overflow: hidden;
  }
  .playerName {
    color: #343434;
  }
  .detail-txt {
    color: #999;
    text-decoration: underline;
  }
  .name-line {
    border-bottom: 2px solid #e0e1e0;
  }
  .my-pic {
    width: 36px;
    height: 36px;
    margin: 0 12px;
  }
  .buy-btn {
    color: #fff;
    width: 94px;
    height: 44px;
    background: #bf2935;
    border-radius: 10px 10px 10px 10px;
  }
}
</style>
