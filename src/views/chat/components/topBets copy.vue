<template>
  <van-popup
    class="chat-top-bets"
    v-model="show"
    v-show="detail.id"
    position="top"
    :overlay="false"
  >
    <div class="top-bets-bot">
      <div
        v-if="head"
        class="top-bets-cont colorfff flex-column justify-around font13"
      >
        <ul class="justify-between p-l-8 p-r-8">
          <li class="d-flex">
            <div class="d-flex align-center">
              <img
                @click="(showother = false), (showmenu = !showmenu)"
                class="m-t-4 chengmenu d-img"
                src="@/assets/img/chengmenu.png"
                alt=""
              />
              <div class="sendBox">
                <p class="font14">
                  <span> {{ detail.lotteryNameH5 }}</span>
                </p>
                <div class="cycleBox">
                  <span> {{ prize.cycleNum }}期</span>
                </div>
              </div>
            </div>
          </li>
          <li class="cycleNumBox">
            <div class="center-center">
              <p
                v-for="(v, i) in prize.openArr"
                class="openbets center-center"
                :class="[
                  'openbets' + i,
                  { 'm-r-4': i != prize.openArr.length - 1 },
                ]"
                :key="i"
              >
                <span class="ball-inner">{{ v }}</span>
              </p>
            </div>
          </li>
          <li class="align-center">
            <div class="flex-column align-center">
              <van-count-down :time="detail.nextExpect?.countdown * 1000">
                <template #default="timeData">
                  <div class="colorfff timeData align-center">
                    <span class="block center-center m-r-16">{{
                      timeData.hours >= 10
                        ? timeData.hours
                        : `0${timeData.hours}`
                    }}</span>

                    <span class="block center-center m-r-16">{{
                      timeData.minutes >= 10
                        ? timeData.minutes
                        : `0${timeData.minutes}`
                    }}</span>

                    <span class="block center-center">{{
                      timeData.seconds >= 10
                        ? timeData.seconds
                        : `0${timeData.seconds}`
                    }}</span>
                  </div>
                </template>
              </van-count-down>
              <p class="rightExpect">{{ detail.nextExpect.nextExpect }}期</p>
            </div>
            <div>
              <p
                class="align-center color-yellow m-l-16"
                @click="showother = !showother"
              >
                <span class="goBetTxt">往期</span>
                <!-- <van-icon class="rightArrow" name="arrow" /> -->
              </p>
              <p
                class="align-center color-yellow m-l-16 m-t-8"
                @click="
                  $router.push({
                    path: `/game/hall`,
                    query: {
                      id: curCat.id,
                      type: curCat.lotteryType,
                    },
                  })
                "
              >
                <span class="goBetTxt past">下注</span>
                <!-- <van-icon class="rightArrow" name="arrow" /> -->
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div ref="popup" @click="showother = true">
        <div v-if="showother" class="other-prize-box">
          <ul
            class="align-center other-prize"
            v-for="(v, i) in otherPrize"
            :key="i"
          >
            <li class="center-center cycleNum">{{ v.cycleNum }}期</li>
            <li class="center-center colorfff">
              <p
                v-for="(v2, i2) in v.openArr"
                :key="i2"
                class="openbets center-center"
                :class="[
                  'openbets' + i2,
                  { 'm-r-4': i2 != prize.openArr.length - 1 },
                ]"
              >
                <span class="ball-inner">{{ v2 }}</span>
              </p>
            </li>
            <li style="opacity: 0"><van-icon name="arrow-down" /></li>
          </ul>
        </div>
      </div>
      <div class="select-box" v-if="showmenu">
        <div
          class="select"
          v-for="(item, index) in catList"
          :key="index"
          @click="changeId(item.id)"
          :class="{ on: id === item.id }"
        >
          {{ item.lotteryNameH5 }}
        </div>
      </div>
      <!-- 上拉 -->
      <!-- <p class="slides" :class="{ slidesclose: !head }" @click="toggleHead"></p> -->
    </div>
  </van-popup>
</template>

<script>
import userApi from "@/api/user";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      show: true,
      id: null,
      results: [],
      head: true,
      showother: false,
      showmenu: false,
      detail: {
        mulConfig: [],
        nextExpect: {},
      },
    };
  },
  computed: {
    ...mapGetters(["catList"]),
    prize() {
      return this.results[0] || {};
    },
    otherPrize() {
      console.log(this.results);
      return this.results.slice(1);
    },
    curCat() {
      return this.catList.find((v) => v.id === this.id);
    },
  },
  watch: {
    head(val) {
      if (!val) {
        this.showother = false;
        this.showmenu = false;
      }
    },
  },
  methods: {
    toggleHead() {
      this.head = !this.head;
      this.$emit("update-head", this.head); // 向父组件传递head的状态
    },
    open() {
      this.show = true;
    },
    async lotteryBetsOrder() {
      const query = {
        id: this.id,
        pageNo: 1,
        pageSize: 8,
      };
      const [err, res] = await userApi.lotteryHisExpect(query);
      if (err) {
        return;
      }
      res.data.results = res.data.results.map((v) => {
        v.openArr = v.openNum.split(",");
        return v;
      });
      this.results = res.data.results;
    },
    async getDetail() {
      const [err, res] = await userApi.betsDetail({ id: this.id });
      if (err) return;
      res.data.mulConfig = JSON.parse(res.data.mulConfig);
      //value
      if (!res.data.nextExpect) {
        res.data.nextExpect = {};
      }
      if (
        this.detail.id !== res.data.id ||
        this.detail.nextExpect.nextExpect !== res.data.nextExpect.nextExpect
      ) {
        this.detail = res.data;
        this.lotteryBetsOrder();
      }
    },
    changeId(id) {
      this.id = id;
      sessionStorage.setItem("lotteryId", id);
      this.getDetail();
      this.showmenu = false;
    },

    handleClickOutside(event) {
      // 如果弹框存在并且点击不在弹框内部
      if (
        this.showother &&
        this.$refs.popup &&
        !this.$refs.popup.contains(event.target)
      ) {
        if (event.target.innerHTML != "往期") {
          this.showother = false;
        }
      }
    },
  },
  created() {
    this.id = +sessionStorage.getItem("lotteryId") || +this.catList[0].id;
    this.getDetail();
    //getDetail d定时检查
    this.timer = setInterval(() => {
      this.getDetail();
    }, 6000);
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  },
};
</script>
<style scoped lang="scss">
.chat-top-bets {
  z-index: 3 !important;
  padding-top: 90px;
  overflow: visible;
}

.top-bets-bot {
  position: relative;
}

$height: 246px;
$tabwidth: 686px;

.box-p-t {
  padding-top: $height;
}

.top-bets-cont {
  // background: linear-gradient(180deg, #6795f7 0%, #2d62f6 100%);
  background: #3e4f9d;
  border-radius: 0px 0px 0px 0px;
  border: 1px solid #707070;
  padding: 8px 0;
  .table-lists {
    width: $tabwidth;
    height: 66px;
    background: #7284d8;
    border-radius: 12px 12px 12px 12px;
    margin: 0 auto;
  }

  .color-yellow {
    color: #f6c343;

    .goBetTxt {
      font-weight: normal;
      font-size: 20px;
      color: #fff;
      text-align: center;
      font-style: normal;
      text-transform: none;
      line-height: 40px;
      width: 96px;
      height: 40px;
      border-radius: 8px;
      border: 2px solid #ffffff;
    }
    .past {
      background: linear-gradient(180deg, #ff6267 0%, #e7474c 100%);
      border: none;
    }

    .rightArrow {
      margin-left: 1px;
      margin-top: 1px;
    }
  }
}

.slides {
  width: 134px;
  height: 23px;
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  background: url("@/assets/img/close-bet.png") no-repeat center;
  background-size: 100% 100%;
}

.slidesclose {
  background: url("@/assets/img/open-bet.png") no-repeat center;
  background-size: 100% 100%;
}

.openbets {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  padding: 4px; /* 彩色边框厚度 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.ball-inner {
  width: 100%;
  height: 100%;
  line-height: 16px;
  border-radius: 50%;
  background-color: white;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
}
.openbets0 {
  background: linear-gradient(180deg, #ff6267 0%, #e7474c 100%);
}
.openbets1 {
  background: linear-gradient(180deg, #32c5ff 0%, #6236ff 100%);
}

.openbets2 {
  background: linear-gradient(180deg, #de9fe7 0%, #c145d3 100%);
}

.openbets3 {
  background: linear-gradient(180deg, #62edff 0%, #00ad8c 100%);
}

.openbets4 {
  background: linear-gradient(180deg, #f7b500 0%, #fa6400 100%);
}

.other-prize-box {
  margin-top: 14px;
  height: 298px;
  overflow-y: scroll;
  overflow-x: hidden;
  .other-prize {
    width: $tabwidth;
    margin: 0 auto;
    box-sizing: border-box;
    // height: 88px;
    padding-bottom: 16px;
    // border-bottom: 1px solid #f5f6f7;
    font-size: 20px;
    color: #242424;
    margin-left: 66px;
    .cycleNum {
      padding-right: 10px;
    }
  }
}

.select-box {
  position: relative;
  background: #eaeaea;
  padding: 40px 34px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 16px;
  width: 100%;

  .select {
    width: 158px;
    height: 56px;
    text-align: center;
    line-height: 52px;
    // border: 1px solid #999999;
    background: #fff;
    border-radius: 14px;
    color: #666666;
    font-size: 22px;
    overflow: hidden;

    &.on {
      color: #bf2935;
      border: 1px solid #bf2935;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        background: url("@/assets/img/Welfare3D/dui1.png") no-repeat;
        background-size: 100% auto;
        width: 36px;
        height: 36px;
        right: -1px;
        bottom: -1px;
      }
    }
  }
}

.timeData {
  //221px x 76px
  // width: 221px;
  // height: 76px;

  .block {
    background: url("@/assets/img/bets-num.png") no-repeat;
    background-size: 100% 100%;
    width: 39.5px;
    height: 39.5px;
    font-family: Bebas Neue, Bebas Neue;
    font-weight: 400;
    font-size: 32px;
    color: #000000;
    line-height: 22px;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
}

.chengmenu {
  width: 50px;
  height: 50px;
}

.sendBox {
  .cycleBox {
    span {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 20px;
      color: #ffffff;
      line-height: 22px;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }
  }
}
.cycleNumBox {
  display: flex;
  justify-content: center;
  // align-items: end;
  align-items: flex-end;
  padding-bottom: 4px;
}

.thirdBox {
  margin-left: 16px;
}

.rightExpect {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 20px;
  color: #ffffff;
  line-height: 22px;
  // letter-spacing: 2px;
  text-align: center;
  font-style: normal;
  text-transform: none;

  margin-top: 8px;
}
</style>
