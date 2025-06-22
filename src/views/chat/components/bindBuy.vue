<template>
  <div>
    <div class="my-group-buy" @click="goDetail">
      <!-- <p class="my-title center-center">{{ doc.data.lottery }}全天计划</p> -->
      <div class="card-header space-between">
        <div>
          <div class="title">
            {{ doc.data.lottery }}全天计划
          </div>
          <div class="issue">期号：{{ doc.data.expect }}</div>
        </div>
        <button class="btn">跟投</button>
      </div>
      <p class="center-center" style="height: 72px;" v-if="!detail.id"><van-loading /></p>
      <template v-else>
        <div
          class="card-body"
          v-for="(item, index) in betCode.filter((v, k) => k == 0)"
          :key="index"
        >
          <div class="modeBox space-between" v-if="detail.visibility==0">
            <div class="mode">
              {{
                !detail.betCode ? getVisibility(detail.visibility) : item.name
              }}
            </div>
            <div class="price">
              {{ divide(detail.myBetCount / 100, false) }}元
            </div>
          </div>
          <div class="card-bottom">
              <ul class="disclosed space-between" v-if="!detail.betCode">
                <li>
                  {{ getVisibility(detail.visibility) }}
                </li>
                <li class="money">
                  {{ divide(detail.myBetCount / 100, false) }}元
                </li>
              </ul>
              <div class="ball-box" v-else>
                <div
                  class="ballArr"
                  v-for="(group, groupIndex) in item.positions"
                  :key="groupIndex"
                >
                  <div class="ball " v-for="(num, index) in group" v-if="index<3" :key="`${groupIndex}-${index}`">
                    {{ num }}
                  </div>
                  <!-- 不是最后一组就显示竖线分隔符 -->
                  <div v-if="groupIndex < item.positions.length - 1" class="divider"></div>
                </div>
              </div>
            <!-- <button class="btn">跟投</button> -->
          </div>
        </div>
      </template>

      <!-- <div class="conts font12"> -->
      <!-- <p class="lottery font13 align-center">{{ doc.data.lottery }}</p> -->
      <!-- <ul class="list-txt expect expect-color" style="margin-top: 14px;">
          <li class="d-flex">
            <p>期号:</p>
            <p>{{ doc.data.expect }}</p>
          </li>
        </ul>
        <p class="center-center" v-if="!detail.id"><van-loading /></p>
        <template v-else>
          <ul
            class="bet-code list-txt expect-color"
            v-for="(item, index) in betCode.filter((v, k) => k == 0)"
            :key="index"
          >
            <li class="d-flex">
              <p>投注玩法:</p>
              <p class="x-auto no-wrap contentColor">
                {{
                  !detail.betCode ? getVisibility(detail.visibility) : item.name
                }}
              </p>
            </li>
            <li class="d-flex">
              <p class="no-shrink">投注内容:</p>
              <p class="x-auto no-wrap  contentColor"> -->
      <!-- {{ item.positions?.map((subArr) => subArr.join("")).join("|")}} -->
      <!-- {{
                  !detail.betCode
                    ? getVisibility(detail.visibility)
                    : item | showContent
                }}
              </p>
            </li>
          </ul>
          <ul class="bet-code list-txt expect-color" v-if="detail.myBetCount">
            <li class="d-flex">
              <p>投注金额:</p>
              <p class="x-auto no-wrap moneyColor">
                {{ divide(detail.myBetCount / 100, false) }}元
              </p>
            </li>
          </ul>
        </template> -->
      <!-- <p class="user-list">计划无神,跟反自由</p> -->
      <!-- <p class="btns-bet center-center  ">我要跟投</p> -->
    </div>
  </div>
</template>

<script>
import userApi from "@/api/user";
export default {
  name: "PopupMoney",
  data() {
    return {
      show: true,
      detail: {},
    };
  },
  filters: {
    showContent: (str) => {
      console.log("str", str);
      let arr = str.positions;
      if (arr?.length === 1) {
        // 只有一个数组，直接用竖线连接
        return arr[0].join("|");
      } else {
        // 多个数组，用竖线连接每个子数组
        return arr?.map((subArr) => subArr.join("")).join("|");
      }
    },
  },
  props: {
    doc: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    isMe() {
      // console.log("this.doc.playerId ", this.doc.playerId);
      // console.log("this.user.id ", this.user.id);
      return this.doc.playerId === this.user.id;
    },
    theOne() {
      return this.$store.state.theOne;
    },
    betCode() {
      if (this.doc.data.betCode) {
        return this.$util.parseFourStarInputNormal(this.doc.data.betCode);
      }
      return [];
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    countPrice(item) {
      if (this.theOne.includes(item.name)) {
        return item.price;
      }
      return item.quantity * item.multiplier * item.price;
    },
    showContent(v) {
      //visibility 0公开 1仅对跟单者公开 2截止后公开 3永久保密
      if (v === 0) {
        return true;
      }
      if (v === 1) {
        return this.detail.joins.some((v) => v.playerId === this.user.id);
      }
      if (v === 2) {
        return +this.detail.status === 4;
      }
      return false;
    },
    getVisibility(v) {
      const docs = [
        {
          name: "公开",
          status: 0,
        },
        {
          name: "仅对跟单者公开",
          status: 1,
        },
        {
          name: "截止后公开",
          status: 2,
        },
        {
          name: "永久保密",
          status: 3,
        },
      ];
      return (docs.find((doc) => doc.status === v) || {}).name;
    },
    btmStatus(v) {
      return (this.$store.state.btmStatus.find((doc) => +doc.id === +v) || {})
        .name;
    },
    goDetail() {
      console.log(this.doc.data, "---");
      this.$emit("openBetPop", this.doc.data.id);
      // this.$router.push(`/purchase-record-details?id=${this.doc.data.id}`);
    },
    async visib() {
      if (this.detail.id) return;
      const [err, res] = await userApi.betsOrderDetail({
        id: this.doc.data.id,
      });
      if (err) return;
      this.detail = res.data;
    },
  },
};
</script>
<style scoped lang="scss">
.my-group-buy {
  cursor: pointer;
  width: 488px;
  background: #fff;
  border-radius: 20px;
  // border-radius: 16px 16px;
  overflow: hidden;

  .my-title {
    height: 58px;
    // background: #e7474c;
    background: linear-gradient(180deg, #ff6267 0%, #e7474c 100%);
    color: #fff;
  }

  .list-txt {
    color: #505050;
  }

  .conts {
    padding: 0 24px 24px;
    font-size: 24px;
    background: url("@/assets/img/room.png") no-repeat 378px 4px #fff;
    background-size: 80px 80px;
  }

  .expect {
    margin-bottom: 8px;
  }

  .expect-color {
    & > li {
      p:first-child {
        margin-right: 24px;
        color: #505050;
      }

      // p:last-child {
      //   color: #b78756;
      // }
    }
  }

  .lottery {
    font-size: 26px;
    height: 60px;
    color: #000;
  }

  .bet-code {
    & > li {
      margin-bottom: 8px;

      p:first-child {
        margin-right: 16px;
      }
    }
  }

  .btm-status {
    padding: 24px;
    background-color: #eff8ff;
  }

  .color-green {
    color: #02b500;
  }

  .color-red {
    color: #e7474c;
  }

  .user-list {
    padding: 24px 0;
  }

  .btns-bet {
    height: 62px;
    background: #ff4d3e;
    border-radius: 16px;
    color: #fff;
    margin-top: 20px;
  }
}

.bind-bet-pop {
  border-radius: 24px 24px 0px 0px;
  height: 126px;
}

.contentColor {
  font-weight: 1000;
  font-size: 24px;
  color: #242424;
  text-align: center;
  font-style: normal;
  text-transform: none;
}

.moneyColor {
  font-weight: 500;
  font-size: 24px;
  color: #ff4d3e;
  text-align: center;
  font-style: normal;
  text-transform: none;
}

// 新样式修改
.card-header {
  background: linear-gradient(180deg, #ff6267 0%, #e7474c 100%);
  color: white;
  padding: 18px 26px;
  position: relative;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  align-items: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
}

.tag {
  background: white;
  color: #e3566d;
  font-size: 18px;
  padding: 4px 12px;
  border-radius: 8px;
  margin-left: 12px;
}

.icon {
  position: absolute;
  right: 24px;
  top: 24px;
  width: 48px;
  height: 48px;
}

.issue {
  font-size: 20px;
  // margin-top: 4px;
}

.card-body {
  // padding: 12px;
  background-color: #fff;
  position: relative;
  .ball-box {
    display: flex;
    flex-direction: row;
    .ballArr {
      display: flex;
        .ball {
        background-image: url(../../../assets/img/qiu.png);
        background-size: 100% 100%;
        width: 36px;
        height: 36px;
        font-size: 22px;
        text-align: center;
        line-height: 36px;
        margin:0 2px;
        // margin-right: 24px;
      }
      .divider {
        height: 32px;
        width: 2px;
        background: #B6BABE;
        margin: 0 8px;
      }
    }
    
  }
}
.modeBox {
  background: #ffedeb;
  padding: 18px 26px 18px 26px;
}
.card-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 18px 26px;
  font-weight: 500;
  font-size: 22px;
  color: #242424;
  .disclosed {
    width: 100%;
    .money {
      font-weight: 500;
      font-size: 22px;
      color: #FF4D3E;
    }
  }
}

.mode {
  font-weight: bold;
  font-size: 22px;
}

.price {
  // position: absolute;
  // right: 12px;
  // top: 12px;
  font-weight: 500;
  font-size: 22px;
  color: #FF4D3E;
}

.numbers {
  display: flex;
  gap: 20px;
  margin-top: 24px;
}

.btn {
  width: 96px;
  height: 44px;
  line-height: 44px;
  border: 1px solid #ff4d3e;
  color: #ff4d3e;
  background: white;
  border-radius: 22px;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
}
</style>
