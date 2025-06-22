<template>
  <div class="myballContainer">
    <div class="sheet-overlay" v-if="showAllLottty"></div>
    <!-- 选项列表 -->
    <transition name="fade">
      <div class="sheet-content" v-if="showAllLottty">
        <div
          v-for="(item, index) in sysList"
          :key="index"
          :class="item.id == chooseLottyType ? 'dangerBtn' : 'default'"
          class="game-button"
          @click="selectOption(item, index)"
        >
          {{ item.name }}
          <div class="checkImg">
            <img
              src="../assets/img/rit-re.png"
              alt=""
              v-if="item.id == chooseLottyType"
            />
          </div>
        </div>
      </div>
    </transition>

    <AppTopBar class="app-top-bar" topBarTitle="购票记录">
      <template v-slot:right>
        <div class="right-box" @click="AllLotttyClick">
          <div class="allLot">{{ chooseLottyName }}</div>
          <img src="../assets/img/gc_alllott.png" alt="" />
        </div>
      </template>
    </AppTopBar>

    <div class="whereBox">
      <ul
        class="align-center justify-between header"
        style="margin-top: 5px; padding: 0 10px"
      >
        <div class="whereBtnsLeft">
          <div
            v-for="(item, index) in types"
            :key="index"
            class="choose_btn"
            :class="choosType == item.id ? 'checkType' : ''"
            @click="typeChooseClick(item)"
          >
            {{ item.name }}
          </div>
        </div>

        <div class="whereBtnsRight center-center" @click.stop="checkDayModal">
          <div class="dayText">
            {{ chooseDayTxt }}
          </div>
          <div class="arrow">
            <van-icon name="arrow-down" size="14px" />
          </div>
          <!-- :style="!showDayCon ? 'display: none;' : 'display: block'"  -->

          <transition name="slide-fade">
            <div class="day-content" v-show="showDayCon">
              <div
                v-for="(item, index) in daylists"
                :key="index"
                :class="item.id == chooseDayID ? 'dangerChooseBtn' : ''"
                class="day-button"
                @click="dayChooseClick(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </transition>
        </div>

        <!-- <li class="color333">
  <SelectActionSheet @select="params.type = $event" :id="params.type" :actions="types" />
</li>
<li class="color333">
  <SelectActionSheet @select="params.openStatus = $event" :id="params.openStatus" :actions="navs" />
</li>
<li class="color333">
  <SelectActionSheet @select="params.lotteryId = $event" :id="params.lotteryId" :actions="sysList" />
</li>
<li class="check center-center color-fff" @click="lotteryBetsOrder({ pageNo: 1 })">
  查询
</li> -->
      </ul>
      <div class="tab-box">
        <div
          class="tab"
          v-for="(item, index) in navs"
          :key="index"
          @click="navChooseClick(item)"
          :class="{ tabActive: chooseTabID == item.id }"
        >
          {{ item.name }}
          <div class="line" v-if="chooseTabID == item.id"></div>
        </div>
      </div>
    </div>

    <div class="listBox">
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
            @click="gotDetails(item)"
          >
            <!-- <div class="bottom">
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
                  {{
                    item.status == 2 ? "已撤销" : getOpenStatus(item.openStatus)
                  }}
                </div>

                <van-icon name="arrow" class="arrow" />
              </div>
            </div> -->
            <div class="bottom">
              <div class="left">
                {{ getName(item.lotteryId) }}
              </div>
              <div class="right">第{{ item.expect }}期</div>
            </div>
            <div class="bottom">
              <div class="left">
                <div class="d1 text-ellipsis">
                  投注金额：<span class="onBlack">{{
                    divide(item.money)
                  }}</span>
                </div>
              </div>
              <div v-if="+item.openStatus === 2" class="num text-ellipsis">
                +{{ divide(item.moneyIncome) }}
              </div>
              <div v-else class="normal">
                {{
                  item.status == 2 ? "已撤销" : getOpenStatus(item.openStatus)
                }}
              </div>
            </div>
            <div class="top">
              <div class="left">
                {{ $dayjsTime(item.createdAt) }}
              </div>
              <div class="right">{{ getTxt(item) }}</div>
            </div>

            <!-- <div class="top">
              <div class="left">
                {{ getName(item.lotteryId) }}
              </div>
              <div class="right">第{{ item.expect }}期</div>
            </div> -->
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/user";
import { mapGetters } from "vuex";
const initForm = () => ({
  lotteryId: -1,
  openStatus: -1,
  type: 1,
  pageNo: 1,
  pageSize: 10,
});
export default {
  name: "MyBallRecord",
  data() {
    return {
      tabId: -1,
      types: [
        // {
        //   name: "全部记录",
        //   id: -1,
        // },
        {
          name: "自购",
          id: 1,
        },
        {
          name: "合买",
          id: 2,
        },
        {
          name: "追号",
          id: 3,
        },
      ],
      //0未开奖1未中奖2已中奖
      navs: [
        {
          name: "全部",
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
      daylists: [
        // {
        //   name: "全部时间",
        //   id: -1,
        // },
        {
          name: "7天",
          id: 1,
        },
        {
          name: "15天",
          id: 2,
        },
        {
          name: "30天",
          id: 3,
        },
      ],
      date: [],
      loading: false,
      finished: false,
      params: initForm(),
      tableData: {
        totalPage: null,
        totalCount: 0,
        results: [],
      },
      fromRoute: null, // 存储前一个路由
      showAllLottty: false,
      chooseLottyType: -1,
      chooseLottyName: "全部游戏",
      choosType: 1,
      showDayCon: false,
      chooseDayTxt: "7天",
      chooseDayID: 0,
      chooseTabID: -1,
      scrollTop: 0, // 记录页面滚动位置
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.fromRoute = from; // 只能在 next() 里访问 this
    });
  },
  props: {
    id: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    cashDetail() {
      return this.$store.state.cashDetail;
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
    closeMenuType() {
      this.showAllLottty = false;
    },
    AllLotttyClick() {
      this.showAllLottty = !this.showAllLottty;
    },
    // 禁止滚动的事件处理函数
    preventScroll(event) {
      event.preventDefault(); // 阻止默认的滚动行为
    },
    preventKeyScroll(event) {
      const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", " "]; // 禁止的键
      if (keys.includes(event.key)) {
        event.preventDefault();
      }
    },
    selectOption(item, index) {
      console.log("item", item);
      this.chooseLottyType = item.id;
      this.params.lotteryId = item.id;
      this.chooseLottyName = item.name;
      this.showAllLottty = false;
      this.params.pageNo = 1;
      this.params.pageSize = 10;
      this.tableData.results = [];
      this.lotteryBetsOrder();
      if (this.showAllLottty) {
        // 记录当前滚动位置，防止回弹
        this.scrollTop = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${this.scrollTop}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.overflow = "hidden";

        // 禁止鼠标滚动 & 触摸滚动
        document.addEventListener("wheel", this.preventScroll, {
          passive: false,
        });
        document.addEventListener("touchmove", this.preventScroll, {
          passive: false,
        });
        document.addEventListener("keydown", this.preventKeyScroll);
      } else {
        // 恢复滚动
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";

        // 滚回原位置，防止页面跳跃
        window.scrollTo(0, this.scrollTop);

        // 解除禁止滚动
        document.removeEventListener("wheel", this.preventScroll);
        document.removeEventListener("touchmove", this.preventScroll);
        document.removeEventListener("keydown", this.preventKeyScroll);
      }
    },

    typeChooseClick(item) {
      this.choosType = item.id;
      this.params.type = item.id;
      this.tableData.results = [];
      this.params.pageNo = 1;
      this.params.pageSize = 10;
      this.lotteryBetsOrder();
    },
    checkDayModal() {
      this.showDayCon = !this.showDayCon;
    },
    closeDayBox(event) {
      console.log("event123123", event);
      this.showDayCon = false;
    },
    dayChooseClick(item) {
      this.chooseDayID = item.id;
      console.log("this.chooseDayID", this.chooseDayID);

      // this.params.type = item.id
      this.chooseDayTxt = item.name;
      this.showDayCon = false;
      this.$nextTick(() => {
        console.log("this3333", this.showDayCon);

        if (this.showDayCon) {
          this.showDayCon = false;
        } else {
          this.showDayCon = true;
        }
      });
      this.tableData.results = [];
      this.params.pageNo = 1;
      this.params.pageSize = 10;
      this.lotteryBetsOrder();
    },
    navChooseClick(item) {
      this.chooseTabID = item.id;
      this.params.openStatus = item.id;
      this.tableData.results = [];
      this.params.pageNo = 1;
      this.params.pageSize = 10;
      this.lotteryBetsOrder();
    },
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
      // console.log("this.params", this.params);
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
      const docs = res.data?.results || [];
      this.tableData.results = this.tableData.results.concat(docs);
      this.params.pageNo++;
      this.finished = docs.length < this.params.pageSize;
    },
  },
  activated() {
    if (
      [
        "/purchase-my-details",
        "/purchase-record-details",
        "/purchase-pre-details",
      ].includes(this.fromRoute?.path)
    ) {
      this.tableData.results.forEach((item) => {
        if (item.id === this.cashDetail.id) {
          item.openStatus = this.cashDetail.openStatus;
          item.status = this.cashDetail.status;
        }
      });
      return;
    }

    this.lotteryBetsOrder(initForm());
  },
};
</script>
<style scoped lang="less">
.header {
  height: 96px;
  background: #f9f9f9;
}

.myballContainer {
  position: relative;
  background: #f9f9f9;

  .sheet-overlay {
    position: fixed;
    top: 90px;
    z-index: 9999;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 0px 0px 0px 0px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  /* 过渡动画 */
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: transform 0.3s ease-in-out, opacity 0.3s;
  }

  /* 进入时从下往上 */
  .slide-fade-enter {
    transform: translateY(100%);
    opacity: 0;
  }

  /* 离开时从上往下 */
  .slide-fade-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }

  .sheet-content {
    background: #f9f9f9;
    border-radius: 0px 0px 0px 0px;
    position: fixed;
    top: 90px;
    display: flex;
    flex-wrap: wrap;
    padding: 0.26667rem;
    gap: 0.26667rem;
    z-index: 10000;

    .checkImg {
      position: absolute;
      right: 0;
      bottom: -6px;

      img {
        width: 38px;
        height: 38px;
      }
    }

    /* 按钮样式 */
    .game-button {
      position: relative;
      width: 31.4%;
      height: 80px;
      background: #ffffff;
      border: 2px solid #999999;
      font-family: PingFangSC-Regular, PingFangSC-Regular;
      font-weight: normal;
      font-size: 24px;
      color: #242424;
      text-align: center;
      font-style: normal;
      text-transform: none;
      border-radius: 12px !important;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dangerBtn {
      width: 31.4%;
      height: 80px;
      background: #ffffff;
      border: 2px solid #bf2935;
      font-family: PingFangSC-Semibold, PingFangSC-Semibold;
      font-weight: bold;
      font-size: 24px;
      color: #bf2935;
      text-align: left;
      font-style: normal;
      text-transform: none;
      border-radius: 12px !important;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.app-top-bar {
  .right-box {
    color: #fff;
    margin-right: 40px;
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 3px;
    /* 选项区域 */

    .allLot {
      font-family: PingFangSC-Regular, PingFangSC-Regular;
      font-weight: normal;
      font-size: 28px;
      color: #ffffff;
      text-align: right;
      font-style: normal;
      text-transform: none;
    }

    img {
      width: 32px;
      height: 32px;
      margin-left: 8px;
      margin-top: 3px;
    }

    .arrow {
      font-size: 32px;
      margin-left: 5px;
    }
  }
}

.whereBox {
  position: fixed;
  top: 90px;
  width: 100%;
  z-index: 778;
  background: #f9f9f9;
}

.listBox {
  position: absolute;
  top: 280px;
  width: 100%;
  z-index: 777;
}

.whereBtnsLeft {
  width: 300px;
  // height: 66px;
  background: #f9f9f9;
  border-radius: 34px;
  // border: 2px solid #C3C3C3;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .choose_btn {
    width: 200px;
    font-family: PingFangSC-Medium, PingFangSC-Medium;
    font-weight: normal;
    font-size: 24px;
    color: #242424;
    text-align: left;
    font-style: normal;
    text-transform: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0;

    /* 第一个按钮的样式 */
    &:first-child {
      border-radius: 34px 0px 0px 34px;
      border: 1px solid #c3c3c3;
    }

    /* 最后一个按钮的样式 */
    &:last-child {
      border-radius: 0px 34px 34px 0px;
      border: 1px solid #c3c3c3;
    }

    /* 中间按钮的样式（排除第一个和最后一个） */
    &:not(:first-child):not(:last-child) {
      border-radius: 0;
      border-top: 1px solid #c3c3c3;
      border-bottom: 1px solid #c3c3c3;
      border-left: none;
      border-right: none;
    }
  }

  .checkType {
    background: #bf2834;
    // border-radius: 34px 0px 0px 34px;
    // border: 1px solid #C3C3C3;
    font-family: PingFangSC-Medium, PingFangSC-Medium;
    font-weight: normal;
    font-size: 24px;
    color: #ffffff;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
}

.whereBtnsRight {
  width: 148px;
  padding: 15px 0;
  background: #ffffff;
  border-radius: 34px;
  border: 1px solid #dedede;
  position: relative;

  .dayText {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 24px;
    color: #242424;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }

  .day-content {
    width: 148px;
    // height: 180px;
    position: absolute;
    top: 80px;
    z-index: 1000;
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid #dedede;

    .day-button {
      padding: 15px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 10px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24px;
      color: #242424;
      text-align: left;
      font-style: normal;
      text-transform: none;

      /* 中间按钮的样式（排除第一个和最后一个） */
      &:not(:first-child):not(:last-child) {
        border-radius: 0;
        border-top: 1px solid #c3c3c3;
        border-bottom: 1px solid #c3c3c3;
        border-left: none;
        border-right: none;
      }
    }

    .dangerChooseBtn {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 24px;
      color: #bf2935;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }

  .arrow {
    margin-left: 18px;
    // width: 28px;
    // height: 28px;
  }
}

.tab-box {
  display: flex;
  justify-content: space-around;
  border-radius: 0;
  border-top: none;
  border-bottom: 1px solid #ebeef5;
  border-left: none;
  border-right: none;

  .tab {
    width: 25%;
    height: 88px;
    line-height: 88px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 26px;
    color: #242424;
    text-align: center;
    font-style: normal;
    text-transform: none;

    &.on {
      color: #bf2935;
      font-weight: bold;
    }

    .line {
      height: 4px;
      background: #d94545;
      border-radius: 0px 0px 0px 0px;
    }
  }

  .tabActive {
    width: 25%;
    height: 88px;
    line-height: 88px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 26px;
    color: #bf2935;
    text-align: center;
    font-style: normal;
    text-transform: none;
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
  background: #f9f9f9;

  .lists {
    background: #fff;
    margin-top: 20px;
    position: relative;
    font-size: 24px;
    font-family: PingFangSC-Medium, PingFangSC-Medium;
    font-weight: normal;
    color: #333333;
    text-align: left;
    font-style: normal;
    text-transform: none;

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
      padding: 10px 28px;
      display: flex;
      align-items: center;
      color: #999999;

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
      padding: 10px 28px;

      .num {
        color: #bf2935;
        max-width: 300px;
      }

      .normal {
        color: #999999;
      }

      .left {
        flex: 1;

        .text-ellipsis {
          color: #999999;
        }

        .d1 {
          max-width: 400px;

          .on {
            color: #bf2935;
          }

          .onBlack {
            color: #242424;
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
