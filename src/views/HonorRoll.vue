<template>
  <div class="c-page">
    <AppTopBar topBarTitle="连红榜"></AppTopBar>
    <div class="lists-box">
      <div class="lists" v-for="(item, index) in redLists" :key="index">
        <div class="left">
          <div class="img-box" :class="[`i-${index + 1}`]">
            <img :src="item.img" class="img" />
          </div>
          <div class="name-box">
            <div class="name">{{ item.name }}</div>
            <!-- 连红榜专用 -->
            <div class="win" v-if="item.win">
              <div class="num">{{ item.win.num }}</div>
            </div>
            <!-- 大神榜专用 -->
            <div class="god-text" v-if="item.god">
              <div class="num">{{ item.god.text }}</div>
            </div>
          </div>
        </div>
        <div class="right">
          <!-- 连红榜专用 -->
          <div class="bonus-box text-ellipsis" v-if="item.win">
            <div class="num text-ellipsis">{{ item.win.bonus }}</div>
            <div class="text">连红奖金</div>
          </div>
          <!-- 大神榜专用 -->
          <div class="bonus-box god text-ellipsis" v-if="item.god">
            <div class="num text-ellipsis">{{ item.god.num }}%</div>
            <div class="text">大神连胜</div>
          </div>
          <div class="btn">可跟单</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HonorRoll",
  data() {
    return {
      // 连红榜用这份数据
      redLists: [
        {
          img: "",
          name: "连红榜",
          win: {
            num: 6,
            bonus: 9988.09,
          },
        },
        {
          img: "",
          name: "连红榜",
          win: {
            num: 6,
            bonus: 9988.09,
          },
        },
        {
          img: "",
          name: "连红榜",
          win: {
            num: 6,
            bonus: 9988.09,
          },
        },
        {
          img: "",
          name: "连红榜",
          win: {
            num: 6,
            bonus: 9988.09,
          },
        },
        {
          img: "",
          name: "连红榜",
          win: {
            num: 6,
            bonus: 9988.09,
          },
        },
        {
          img: "",
          name: "连红榜",
          win: {
            num: 6,
            bonus: 9988.09,
          },
        },
        {
          img: "",
          name: "连红榜",
          win: {
            num: 6,
            bonus: 9988.09,
          },
        },
      ],
      // 大神榜用这份数据
      godLists: [
        {
          img: "",
          name: "连红榜",
          god: {
            num: 97,
            text: "7中3",
          },
        },
        {
          img: "",
          name: "连红榜",
          god: {
            num: 97,
            text: "7中3",
          },
        },
        {
          img: "",
          name: "连红榜",
          god: {
            num: 97,
            text: "7中3",
          },
        },
        {
          img: "",
          name: "连红榜",
          god: {
            num: 97,
            text: "7中3",
          },
        },
        {
          img: "",
          name: "连红榜",
          god: {
            num: 97,
            text: "7中3",
          },
        },
        {
          img: "",
          name: "连红榜",
          god: {
            num: 97,
            text: "7中3",
          },
        },
        {
          img: "",
          name: "连红榜",
          god: {
            num: 97,
            text: "7中3",
          },
        },
      ],
    };
  },
};
</script>
<style scoped lang="less">
.lists-box {
  padding-left: 36px;
  padding-right: 30px;
  .lists {
    border-bottom: 1px solid #efefef;
    padding: 26px 0;
    display: flex;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      flex: 1;
      margin-right: 40px;
      display: flex;
      .img-box {
        width: 150px;
        height: 150px;
        background-size: 100% auto;
        background-repeat: no-repeat;
        margin-right: 10px;

        &.i-1 {
          background-image: url("@/assets/img/HonorRoll/t1.png");
        }
        &.i-2 {
          background-image: url("@/assets/img/HonorRoll/t3.png");
          .img {
            margin-left: 33px;
            margin-top: 38px;
          }
        }
        &.i-3 {
          background-image: url("@/assets/img/HonorRoll/t2.png");
          .img {
            margin-left: 38px;
            margin-top: 40px;
          }
        }
        .img {
          width: 100px;
          height: 100px;
          border-radius: 100%;
          margin-left: 35px;
          margin-top: 36px;
        }
      }
      .name-box {
        .win {
          background: url("@/assets/img/HonorRoll/ls.png") no-repeat;
          background-size: 100% auto;
          height: 36px;
          width: 132px;
          margin-top: 12px;
          color: #fff;
          .num {
            width: 60px;
            text-align: center;
            height: 36px;
            line-height: 40px;
          }
        }
        .god-text {
          margin-top: 16px;
          .num {
            color: #bf2935;
            font-size: 24px;
            width: 84px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            padding: 0;
            background: url("@/assets/img/HonorRoll/fk.png") no-repeat;
            background-size: 100% auto;
          }
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      .bonus-box {
        color: #bf2935;
        margin-right: 18px;
        .num {
          font-size: 40px;
          font-weight: 600;
        }
        .text {
          font-size: 24px;
        }
        &.god {
          text-align: center;
          width: 100px;
          margin-right: 78px;
        }
      }
      .btn {
        width: 112px;
        height: 54px;
        line-height: 54px;
        text-align: center;
        border-radius: 4px 4px 4px 4px;
        background: #ff8848;
        color: #fff;
      }
    }
  }
}
</style>
