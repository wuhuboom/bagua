<template>
  <div class="c-page" :class="{ overHidden: isDragging }">
    <div class="center-center m-t-48" v-if="!value">
      <van-loading color="#bf2935" />
    </div>
    <template v-else>
      <!-- 顶栏 -->
      <AppTopBar
        class="app-top-bar"
        :styleObj="{ backgroundColor: '#202521' }"
        :titleSolt="true"
      >
        <template v-slot:title>
          <div>{{ nameStr }}</div>
        </template>
        <template v-slot:right>
          <div
            class="m-r-32 colorfff font14"
            @click="
              $router.push({
                path: '/winning-list',
                query: {
                  id: id,
                  lotteryName: detail.lotteryNameH5,
                },
              })
            "
          >
            往期开奖
          </div>
        </template>
      </AppTopBar>
      <div class="header-desc font12">
        <div class="center-center head-game">
          <div class="txt">
            <div>玩法</div>
          </div>
          <div
            class="title-desc center-center"
            @click="showSelect = !showSelect"
          >
            <!-- {{ detail.lotteryNameH5 }} -->
            {{ value }}
            <img
              class="d-img downd m-l-8"
              src="@/assets/img/downd.png"
              alt=""
            />
          </div>
          <div class="center-box" v-if="showSelect">
            <div class="bg" @click="showSelect = false"></div>
            <div class="downs-box">
              <div class="select-box">
                <div
                  class="select"
                  v-for="(item, index) in firstNavs"
                  :key="index"
                  @click="changeNav(item)"
                  :class="{ on: curTab === item }"
                >
                  {{ item }}
                </div>
              </div>
              <div v-for="(item, index) in secondNavs" :key="index">
                <p class="desc">{{ `${item.name}` }}</p>
                <div class="select-box">
                  <div
                    class="select"
                    :data-name="v.txt"
                    v-for="(v, i) in item.list"
                    :key="i"
                    @click="(showSelect = false), (value = v.txt)"
                    :class="{ on: value === v.txt }"
                  >
                    {{ replaceCat(item.name, v.txt) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="center-center balance">
            <div>
              余额:
              <span class="value">{{ divide(user.balance) }}</span>
              <img class="downd m-l-8" src="@/assets/img/shuaxin.png" alt="" />
            </div>
          </div>
        </div>
        <div class="justify-between py-2 open-result">
          <ul class="flex-column justify-between py-4 content">
            <li class="text-center bet-tip">
              {{ preData.lastExpect.cycleNum }}开奖号码
            </li>
            <li
              v-if="preData.lastExpect.openNum"
              class="align-center chose-ball-list center-center"
            >
              <p
                class="chose-ball font16 center-center colorfff"
                v-for="(item, idx) in preData.lastExpect.openNum.split(',')"
                :key="idx"
              >
                {{ item }}
              </p>
            </li>
          </ul>
          <ul class="flex-column justify-between py-4 content">
            <li class="text-center bet-tip">
              {{ detail.nextExpect.nextExpect }}期投注截止
            </li>
            <li class="center-center">
              <van-count-down
                @finish="openFish"
                @change="changeCount"
                :time="detail.nextExpect?.countdown * 1000"
              >
                <template #default="timeData">
                  <div class="colorfff timeData align-center">
                    <span class="block center-center">{{
                      timeData.hours >= 10
                        ? timeData.hours
                        : `0${timeData.hours}`
                    }}</span>
                    <span class="colon center-center">:</span>
                    <span class="block center-center">{{
                      timeData.minutes >= 10
                        ? timeData.minutes
                        : `0${timeData.minutes}`
                    }}</span>
                    <span class="colon center-center">:</span>
                    <span class="block center-center">{{
                      timeData.seconds >= 10
                        ? timeData.seconds
                        : `0${timeData.seconds}`
                    }}</span>
                  </div>
                </template>
              </van-count-down>
            </li>
          </ul>
        </div>
      </div>
      <div class="main-wrap" :class="{ overHidden: isDragging }">
        <div class="des-box">
          <div class="left">{{ descTxt }}</div>
          <div class="right font10 center-center" @click="randem">
            <img class="d-img ramd m-r-12" src="@/assets/img/ramd.png" alt="" />
            随机一注
          </div>
        </div>
        <transition
          name="fade"
          mode="out-in"
          :class="{ overHidden: isDragging }"
        >
          <component
            :curPre="curPre"
            ref="$cont"
            @total="giveTotal"
            @changemultiple="changemultiple"
            :is="currentComponent"
            :key="value"
            v-bind="getComponentProps"
          ></component>
        </transition>
        <!-- <div class="m-t-32">
          <ul class="bets-desc colorfff font14 justify-around align-center">
            <li class="clear-list list-btn center-center" @click="delALL">
              <van-icon name="delete-o" class="m-r-16" />
              清空列表
            </li>
            <li class="add-list list-btn center-center" @click="add">
              <van-icon name="plus" class="m-r-16" />
              添加至投注列表
            </li>
          </ul>
        </div> -->
        <!-- <ul class="orders-list m-b-32">
          <li class="font16 align-center justify-between">
            <ul class="align-center">
              <li>投注列表</li>
              <li class="font12 align-center">
                <div class="t1">{{ totalALL }}注</div>
                <div class="t2">共{{ btmMoney }}元</div>
              </li>
            </ul>
            <p class="font14" @click="$router.push('/MyBallRecord')">
              购票记录 <van-icon name="arrow" />
            </p>
          </li>
          <li class="orders-cont m-t-32 p-x-24">
            <p v-for="(v, i) in tableList" :key="i" class="orders-item align-center p-b-24">
              <span class="no-shrink m-r-8">
                {{ v.model }} {{ v.total }}注 {{ v.totalMoney }}元
              </span>
              <span>
                {{ v.text }}
              </span>
            </p>
          </li>
        </ul> -->
      </div>
      <BetOn
        :id="id"
        @delALL="delALL"
        @delOne="delOne"
        @buySuccess="buySuccess"
        :tableList="tableList"
        :detail="detail"
        :milliseconds="milliseconds"
        @openChase="openChase"
        @openGroupBuy="openGroupBuy"
        ref="$BetOn"
      />
      <tipsDialog @sure="clearData" ref="$finshDialog" />
      <AppendChase
        :id="id"
        :tableList="showTotalListArr"
        :detail="detail"
        @buySuccess="buySuccess"
        :milliseconds="milliseconds"
        ref="$AppendChase"
      />
      <BuyTogether
        :id="id"
        @delALL="delALL"
        @delOne="delOne"
        @buySuccess="buySuccess"
        :tableList="showTotalListArr"
        :detail="detail"
        :milliseconds="milliseconds"
        ref="$BuyTogether"
      />
      <!-- 底部 BuyTogether -->
      <div class="betting-box">
        <div class="fixed">
          <div class="totleMoneyAndNum">
            <transition name="fade">
              <div class="center total-all" v-if="cacheList.length > 0">
                <div class="t1">
                  已选&nbsp;<span>{{ betTotal }}</span
                  >&nbsp;注
                </div>
                <div class="t2">
                  ，<span>{{ betTotalMoney }}</span
                  >元 <img src="@/assets/img/beto.png" alt="" class="betIcon" />
                </div>
              </div>
            </transition>
          </div>
          <ul class="fixed-up align-center justify-between">
            <div class="clearBox" @click="delALL">
              <!-- <div class="cl_img"> -->
              <img src="@/assets/img/clear.png" alt="" />
              <!-- </div> -->
              <span>清空</span>
            </div>
            <div class="align-center justify-between rightContanier">
              <div class="singleBet">
                每注 <span class="text">{{ priceShow }}元</span>
              </div>
              <!-- <van-stepper v-model="multiple" class="custom-stepper" input-width="60px" /> -->
              <StepInput
                v-model="multiple"
                @fatherMultiple="recvMainMultiple"
                :hideType="true"
                :isWelfare="true"
              />
              <li style="margin-left: 11px">倍</li>
            </div>
          </ul>
          <div class="align-center flex-1 fixed-btm">
            <div class="btnTool">
              <div class="nearBet" @click="$tool.goPage('/myBallRecord')">
                近期投注
              </div>
              <van-badge
                :content="this.showTotalListArr.length"
                max="99"
                color="#ED6E6A"
              >
                <div class="haveIcon" @click="basketClick">
                  <div class="toolicon">
                    <img src="@/assets/img/gcl.png" alt="" />
                  </div>
                  <div class="text">购彩篮</div>
                </div>
              </van-badge>

              <div class="haveIcon" @click="add">
                <div class="toolicon">
                  <img src="@/assets/img/tjxh.png" alt="" />
                </div>
                <div class="text">添加选号</div>
              </div>

              <div
                class="betBtn"
                @click="sureClick"
                :class="{ sureDisplay: showTotalListArr.length == 0 }"
              >
                <div class="nowText">立即投注</div>
                <!-- <div class="moneyNum">¥ {{ totalMoneyAccumulated }}</div> -->
              </div>
              <!-- <div class=" continueBtn" @click="openChase">
                追号
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div
        class="together flex-column center-center movable-div"
        :style="{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
        }"
		v-if="isShowChart"
        @touchstart="startDrag"
        @touchmove="doMove"
        @touchend="stopMove"
      >
        <ul class="room-enter flex-column center-center" v-if="showRoom">
          <li @click="$router.push('/chat')" class="">
            <img class="d-img" src="@/assets/img/room-green.png" alt="" />
          </li>
        </ul>

        <!-- <li>
		  <img @click="showRoom = !showRoom" class="d-img" src="@/assets/img/rooml2.png" alt="" />
		</li> -->
        <!-- <li>
		  <img @click="showRoom = !showRoom" class="d-img" src="@/assets/img/rooml2.png" alt="" />
		</li> -->
        <!-- <div class="group-btn">
          <img class="d-img" @click="openGroupBuy" src="@/assets/img/together.png" alt="" />
        </div> -->
      </div>
    </template>
    <van-popup
      v-model="showShopBasket"
      round
      position="bottom"
      :style="{ height: '55%' }"
    >
      <div class="flex-column center-center basketContanier">
        <div class="align-center space-between head">
          <div class="closeImg" @click="closePopup">
            <img src="@/assets/img/Glyphs.png" />
          </div>
          <div class="centerTitle">{{ shopBasketName }}</div>
          <div class="rigbtn" @click="openGroupBuy">发起合买</div>
        </div>
        <div class="content">
          <van-list>
            <div
              class="flex-column center-center chooseItem"
              v-for="(item, index) in showTotalListArr"
              :key="index"
            >
              <div class="align-center space-between line1">
                <div class="title">{{ item.model }}</div>
                <div class="delBtn" @click="delChooseBtn(index)">
                  <img src="@/assets/img/delchoose.png" />
                </div>
              </div>
              <div class="align-center line2">
                <span>{{ item.text | formatNumbers }}</span>
                <!-- <span>2 3 5 9,</span>
              <span>3 3 5 9,</span> -->
              </div>

              <div class="align-center space-between line3">
                <span>{{ item.total }}注</span>
                <StepInput
                  v-model="item.price"
                  type="currency"
                  hideMinus
                  hidePlus
                  :disabled="true"
                  :isWelfare="true"
                />
                <StepInput
                  v-model="item.multiple"
                  @fatherMultiple="recvSubMultiple"
                  :currIdex="index"
                  :isWelfare="true"
                  :currItemData="item"
                />

                <!-- <van-stepper v-model="item.price" class="custom-stepper hide-stepper" input-width="60px" disabled /> -->
                <!-- <van-stepper v-model="item.multiple" class="custom-stepper" input-width="60px" @plus="plusMul(index)"
                @minus="minusMul(index)" @change="changMul(index)" /> -->
                <span>{{ item.totalMoney }}元</span>
              </div>
            </div>
          </van-list>
        </div>

        <div class="align-center space-between bottom">
          <div class="leftContent">
            <div class="topCon">
              共 <span class="numText">{{ totalSum }}</span> 注
              <span class="numText">{{ totalMoneySum }}</span
              >元
            </div>
            <div class="bottomCon">
              余额：<span class="numText">{{ divide(user.balance) }}</span>
            </div>
          </div>
          <div class="align-center space-between btnBetTool">
            <div class="zhbtn" @click="openChasePop">追号</div>
            <div class="tzbtn" @click="sure">投注</div>
          </div>
        </div>
      </div>
    </van-popup>
	
	<div class="delChatPanel" :style="chatRemovePanelSize" v-if="isDragging">
		<img class="logo"  :style="chatRemoveImgSize" src="@/assets/img/delChat.png" />
	</div>
  </div>
</template>

<script>
import userApi from "@/api/user";
import tipsDialog from "@/components/tipsDialog.vue";
import auth from "@/plugins/auth";
import typeConfigList from "@/plugins/typeConfigList";
import AppendChase from "./components/AppendChase";
import ball1 from "./components/ball1";
import ball10 from "./components/ball10";
import ball11 from "./components/ball11";
import ball12 from "./components/ball12";
import ball13 from "./components/ball13";
import ball14 from "./components/ball14";
import ball15 from "./components/ball15";
import ball16 from "./components/ball16";
import ball17 from "./components/ball17";
import ball18 from "./components/ball18";
import ball19 from "./components/ball19";
import ball2 from "./components/ball2";
import ball20 from "./components/ball20";
import ball21 from "./components/ball21";
import ball22 from "./components/ball22";
import ball23 from "./components/ball23";
import ball24 from "./components/ball24";
import ball25 from "./components/ball25";
import ball26 from "./components/ball26";
import ball27 from "./components/ball27";
import ball28 from "./components/ball28";
import ball29 from "./components/ball29";
import ball30 from "./components/ball30";
import ball31 from "./components/ball31";
import ball32 from "./components/ball32";
import ball33 from "./components/ball33";
import ball3 from "./components/ball3";
import ball4 from "./components/ball4";
import ball5 from "./components/ball5";
import ball6 from "./components/ball6";
import ball7 from "./components/ball7";
import ball8 from "./components/ball8";
import ball9 from "./components/ball9";
import BetOn from "./components/BetOn";
import BuyTogether from "./components/BuyTogether";
import StepInput from "./components/StepInput";
import { mapGetters, mapState } from "vuex";

const chatRemoveImgCss = {
  width: '50px',
  height: '50px',
  marginTop: '-5px',
  marginLeft: '-5px'
}				
const chatRemovePanelCss= {
  width: '300px',
  height: '300px',
  right: '-150px',
  bottom: '-150px',
  paddingLeft: '75px',
  paddingTop: '70px',			
}
export default {
  name: "Welfare3D",
  filters: {
    formatNumbers: (value) => {
      if (!value) return ""; // 防止空值报错
      if (value?.includes("|") && value?.includes(",")) {
        return value?.replace(/,/g, "").replace(/\|/g, "|");
      } else {
        return value?.replace(/\|/g, "|").replace(/,/g, "|");
      }
    },
  },
  data() {
    return {
      showRoom: true,
      milliseconds: 0,
      total: 0,
      preId: 0,
      linkQuery: this.$route.query,
      showMore: false,
      showSelect: false,
      showBeforeLottery: false,
      curTab: "",
      value: "",
      tableData: {},
      preData: {
        hot: [],
        losses: [],
        lastExpect: {},
      },
      catTree: [],
      detail: {
        mulConfig: [],
        nextExpect: {},
      },
      tableList: [],
      cacheList: [],
      multiple: 1,
      nums: [],
      showAllLottty: false,
      chooseLottyType: 0,
      showBetNumBool: false,
      showTotalListArr: [],
      totalNum: 0,
      totalMoneyAccumulated: 0,
      // tirmr: null,
      priceShow: 0,
      showShopBasket: false,
      shopBasketName: "",
      loading: false,
      finished: false,

      position: { x: 30, y: 440 }, // 初始位置
      isDragging: false, // 是否正在拖动
      offset: { x: 0, y: 0 }, // 偏移量，用于计算新位置
	  isRemoveChat: false,
	  isShowChart: true,
	  chatRemoveImgSize: {},
	  chatRemovePanelSize: {}
    };
  },
  components: {
    StepInput,
    BuyTogether,
    AppendChase,
    tipsDialog,
    BetOn,
    ball1,
    ball2,
    ball3,
    ball4,
    ball5,
    ball6,
    ball7,
    ball8,
    ball9,
    ball10,
    ball11,
    ball12,
    ball13,
    ball14,
    ball15,
    ball16,
    ball17,
    ball18,
    ball19,
    ball20,
    ball21,
    ball22,
    ball23,
    ball24,
    ball25,
    ball26,
    ball27,
    ball28,
    ball29,
    ball30,
    ball31,
    ball32,
    ball33,
  },
  watch: {
    // curTab() {
    //   this.setValue();
    // },
    value() {
      // console.log("123123");
      this.total = 0;
      this.viewHistory();

      this.priceShow = this.getPrice(this.value);
    },

    // showTotalListArr: {
    //   handler(newVal) {
    //     newVal.forEach((item, index) => {
    //       const newTotalMoney = (item.total * item.multiple * item.price).toFixed(2);

    //       // 仅在 totalMoney 发生变化时更新，防止死循环
    //       if (newTotalMoney !== item.totalMoney) {
    //         this.$set(this.showTotalListArr, index, {
    //           ...item,
    //           totalMoney: newTotalMoney
    //         });
    //       }
    //     });
    //   },
    //   deep: true
    // }
  },
  computed: {
    elementStyle() {
      return {
        top: `${this.currentY}px`,
        left: `${this.currentX}px`,
        position: "fixed",
      };
    },
    // 总下注数
    betTotal() {
      return this.cacheList.reduce((sum, item) => sum + Number(item.total), 0);
    },
    // 总下注金额
    betTotalMoney() {
      return this.cacheList.reduce(
        (sum, item) => sum + Number(item.totalMoney),
        0
      );
    },
    // 计算 total 的总和
    totalSum() {
      return this.showTotalListArr.reduce(
        (sum, item) => sum + Number(item.total),
        0
      );
    },
    // 计算 price 的总和
    totalMoneySum() {
      return this.showTotalListArr.reduce(
        (sum, item) => sum + Number(item.totalMoney),
        0
      );
    },
    sysList() {
      const arr = [
        // {
        //   lotteryName: "全部游戏",
        //   id: -1,
        // },
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
    user() {
      return this.$store.state.user;
    },
    catList() {
      const arr = [];
      this.$store.state.cat.forEach((item) => {
        arr.push(...item.list);
      });
      return arr;
    },
    lotteryName() {},
    theOne() {
      return this.$store.state.theOne;
    },
    currentComponent() {
		console.log(this.value)
      switch (this.value) {
        // 复式类型
        case "三星直选复式":
        case "后三直选复式":
        case "中三直选复式":
        case "前三直选复式":
          return "ball1";

        // 单式类型
        case "三星直选单式":
        case "后三直选单式":
        case "中三直选单式":
        case "前三直选单式":
          return "ball2";
        case "三星组选组选":
          return "ball27";
        // 和值类型
        case "三星直选和值":
        case "后三直选和值":
        case "中三直选和值":
        case "前三直选和值":
          return "ball3";

        // 组三复式类型
        case "三星组三复式":
        case "后三组三复式":
        case "中三组三复式":
        case "前三组三复式":
          return "ball4";
        case "三星组选组三":
          return "ball18";
		case "三星复式":
		    return "ball33";
        case "三星跨度":
          return "ball25";
        case "三星组选组三胆拖":
          return "ball19";
        // 组三胆拖类型
        case "三星组三胆拖":
        case "后三组三胆拖":
        case "中三组三胆拖":
        case "前三组三胆拖":
          return "ball5";

        // 组三单式类型
        case "三星组三单式":
        case "后三组三单式":
        case "中三组三单式":
        case "前三组三单式":
          return "ball12";
        case "三星组选组三自填":
          return "ball20";
        case "三星组选组六自填":
          return "ball23";
        // 组六复式类型
        case "三星组六复式":
        case "后三组六复式":
        case "中三组六复式":
        case "前三组六复式":
          return "ball6";
        case "三星组选组六":
          return "ball21";
        // 组六胆拖类型
        case "三星组六胆拖":
        case "后三组六胆拖":
        case "中三组六胆拖":
        case "前三组六胆拖":
          return "ball7";
        case "三星组选组六胆拖":
          return "ball22";
        // 组六单式类型
        case "三星组六单式":
        case "后三组六单式":
        case "中三组六单式":
        case "前三组六单式":
          return "ball13";

        // 组选和值类型
        case "中三组选和值":
        case "后三组选和值":
        case "三星组选和值":
          return "ball8";
        case "三星和值":
        case "三星特码":
          return "ball24";
        // 四星类型
        case "四星直选复式":
          return "ball9";
        case "四星直选单式":
          return "ball10";

        // 直选组合类型
        case "后三直选组合":
        case "中三直选组合":
        case "前三直选组合":
          return "ball11";
        case "三星独胆":
        case "三星对子":
          return "ball14";
        case "三星双飞":
          return "ball15";
        case "三星一码百位":
        case "三星一码十位":
        case "三星一码个位":
          return "ball16";
        case "三星二码百十位":
        case "三星二码百个位":
        case "三星二码十个位":
          return "ball17";
        case "三星大小单双":
        case "三星波色龙虎和":
        case "三星豹子顺子对子":
          return "ball26";
        case "大小单双":
          return "ball32";

        // 两星直选类型
        case "后二直选":
        case "前二直选":
          return "ball28";
        // 两星和值类型
        case "后二和值":
        case "前二和值":
          return "ball29";

        // 双星组选类型
        case "后二组选":
        case "前二组选":
          return "ball30";

        // 一星直选类型
        case "后一直选":
          return "ball31";
		
        // 默认情况
        default:
          return "ball1";
      }
    },
    getComponentProps() {
      if (this.value.includes("直选和值")) {
        return {
          className: "flex-start",
        };
      }
      if (this.value === "前三直选复式") {
        return {
          titleText: ["万位", "千位", "百位"],
        };
      }
      if (this.value === "中三直选复式") {
        return {
          titleText: ["千位", "百位", "十位"],
        };
      }
      if (this.value === "后三直选复式") {
        return {
          titleText: ["百位", "十位", "个位"],
        };
      }
      if (this.value === "三星一码百位") {
        return {
          titleText: ["百位"],
        };
      }
      if (this.value === "三星一码十位") {
        return {
          titleText: ["十位"],
        };
      }
      if (this.value === "三星一码个位") {
        return {
          titleText: ["个位"],
        };
      }
      if (this.value === "三星二码百十位") {
        return {
          titleText: ["百位", "十位"],
        };
      }
      if (this.value === "三星二码百个位") {
        return {
          titleText: ["百位", "个位"],
        };
      }
      if (this.value === "三星二码十个位") {
        return {
          titleText: ["十位", "个位"],
        };
      }
      if (this.value === "三星特码") {
        return {
          titleText: ["特码"],
        };
      }
      //后一直选
      if (this.value === "后一直选") {
        return {
          titleText: ["个位"],
        };
      }
      //后二，前二新玩法
      if (this.value === "后二直选") {
        return {
          titleText: ["十位", "个位"],
        };
      }
      //后二，前二新玩法
      if (this.value === "前二直选") {
        return {
          titleText: ["万位", "千位"],
        };
      }
      if (this.value.includes("和值")) {
        return {
          className: "flex-start",
        };
      }
	  //后- 大小单双
	  if (this.value === "大小单双") {
	    return {
	      titleText: ["十位", "个位"],
	    };
	  }
      return {
        betListDocs: this.betListDocs,
      };
    },
    curPre() {
      const {
        losses,
        hot,
        // zu3,
        // zu3_hot,
        // zu6,
        // zu6_hot,
        zxzh1,
        zxzh1_hot,
        zxzh2,
        zxzh2_hot,
        zxzh3,
        zxzh3_hot,
        q2zx,
        q2zx_h,
        h2zx,
        h2zx_h,
      } = this.preData;
      switch (this.value) {
        case "三星直选复式":
          return this.preId === 0 ? losses : hot;
        case "三星一码百位":
          return this.preId === 0 ? losses[0] : hot[0];
        case "三星一码十位":
          return this.preId === 0 ? losses[1] : hot[1];
        case "三星一码个位":
          return this.preId === 0 ? losses[2] : hot[2];
        ////三星二码百十位  三星二码百个位 三星二码十个位
        case "三星二码百十位":
          return this.preId === 0 ? [losses[0], losses[1]] : [hot[0], hot[1]];
        case "三星二码百个位":
          return this.preId === 0 ? [losses[0], losses[2]] : [hot[0], hot[2]];
        case "三星二码十个位":
          return this.preId === 0 ? [losses[1], losses[2]] : [hot[1], hot[2]];
        case "三星组六复式":
        case "三星组选组六":
        case "三星组六胆拖":
        case "三星组选组六胆拖":
        case "三星组三复式":
        case "三星组三胆拖":
        case "前三组三复式":
        case "前三组三胆拖":
        case "前三组六复式":
        case "前三组六胆拖":
        case "前三直选组合":
        case "三星独胆":
        case "三星双飞":
        case "三星对子":
        case "三星复式":
        case "三星组选组三":
        case "三星组选组三胆拖":
        case "三星跨度":
          return this.preId === 0 ? [zxzh1] : [zxzh1_hot];

        case "中三组三复式":
        case "中三组三胆拖":
        case "中三组六复式":
        case "中三组六胆拖":
        case "中三直选组合":
          return this.preId === 0 ? [zxzh2] : [zxzh2_hot];

        case "后三组三复式":
        case "后三组三胆拖":
        case "后三组六复式":
        case "后三组六胆拖":
        case "后三直选组合":
          return this.preId === 0 ? [zxzh3] : [zxzh3_hot];
        //-------------------
        // 四星直选复式
        case "四星直选复式":
          return this.preId === 0
            ? losses.filter((_, k) => k > 0)
            : hot.filter((_, k) => k > 0);

        // 前三直选复式
        case "前三直选复式":
          return this.preId === 0
            ? losses.filter((_, k) => k < 3)
            : hot.filter((_, k) => k < 3);

        // 中三直选复式
        case "中三直选复式":
          return this.preId === 0
            ? losses.filter((_, k) => k > 0 && k < 4)
            : hot.filter((_, k) => k > 0 && k < 4);

        // 后三直选复式
        case "后三直选复式":
          return this.preId === 0
            ? losses.filter((_, k) => k > 1 && k < 5)
            : hot.filter((_, k) => k > 1 && k < 5);

        // 前二直选
        case "前二直选":
          return this.preId === 0
            ? losses.filter((_, k) => k < 2)
            : hot.filter((_, k) => k < 2);

        // 后二直选
        case "后二直选":
          return this.preId === 0
            ? losses.filter((_, k) => k > 2 && k < 5)
            : hot.filter((_, k) => k > 2 && k < 5);

        // 后一直选
        case "后一直选":
          return this.preId === 0
            ? losses.filter((_, k) => k > 3 && k < 5)
            : hot.filter((_, k) => k > 3 && k < 5);

        case "前二组选":
          return this.preId === 0 ? [q2zx] : [q2zx_h];

        case "后二组选":
          return this.preId === 0 ? [h2zx] : [h2zx_h];

        // 默认情况
        default:
          return [];
      }
    },
    id() {
      this.chooseLottyType = this.linkQuery.id;
      return +this.linkQuery.id;
    },
    tabs() {
      if (+this.linkQuery.type === 1) {
        return {
          lotteryType1: typeConfigList["lotteryType1"],
        };
      }
      return {
        // lotteryType0: typeConfigList["lotteryType0"],
        lotteryType4: typeConfigList["lotteryType4"],
        lotteryType3: typeConfigList["lotteryType3"],
        lotteryType2: typeConfigList["lotteryType2"],
      };
    },
    firstNavs() {
      console.log("catList", this.catList);
      return this.catTree.map((item) => item.name);
    },
    secondNavs() {
      return this.catTree.find((item) => item.name === this.curTab)?.list || [];
    },
    hideMulConfig() {
      const arr = this.detail.mulConfig.filter((item) => +item.show === 0);
      return arr.map((item) => item.title);
    },
    descTxt() {
      const newAmount = this.curItemValue.value || "";
      const text = this.curItemValue.desc || "";
      if (!newAmount) return text;
      return text.replace(/\d+元/, newAmount + "元");
    },
    curItemValue() {
      let arr = {};
      this.secondNavs.forEach((item) => {
        item.list.forEach((v) => {
          if (v.txt === this.value) {
            arr = v;
          }
        });
      });
      return arr;
    },
    totalALL() {
      return this.tableList.reduce((pre, cur) => pre + cur.total, 0);
    },
    btmMoney() {
      return this.tableList.reduce((pre, cur) => pre + cur.totalMoney * 1, 0);
    },

    totalMoney() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.docsListValue = "";
      if (this.total == 0) return 0;
      const betList =
        this.lastTree.find((doc) => doc.txt === this.value)?.betList || [];
      // console.log("theOne", this.theOne);
      // console.log("this.theOne.includes(this.value)", this.theOne.includes(this.value));
      if (this.theOne.includes(this.value)) {
        if (["三星组选组选"].includes(this.value)) {
          const group3 = []; // 组三（有两个相同数字）
          const group6 = []; // 组六（三个数字都不同）

          this.nums.forEach((num) => {
            const digits = num.split("").sort(); // 分割为数组并排序
            const uniqueDigits = new Set(digits); // 转 Set 统计不同数字

            if (uniqueDigits.size === 2) {
              group3.push(num); // 组三
            } else if (uniqueDigits.size === 3) {
              group6.push(num); // 组六
            }
          });

          console.log("组三:", group3, "组六:", group6);

          // 获取 price3 和 price6
          let price3Obj = betList.find((item) => item.txt === "组三");
          let price6Obj = betList.find((item) => item.txt === "组六");

          let price3 = price3Obj ? price3Obj.bet : 0;
          let price6 = price6Obj ? price6Obj.bet : 0;
          let value3 = price3Obj ? price3Obj.value : 0;
          let value6 = price6Obj ? price6Obj.value : 0;
          // 计算总金额
          let totalAmount =
            (group3.length * price3 + group6.length * price6) * this.multiple;

          // 计算 docsListValue
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.docsListValue = this.divide(
            group3.length * value3 + group6.length * value6,
            false
          );

          return totalAmount;
        }

        // 组三金额=list[号码个数-2].bet
        // 组六金额=list[号码个至少输入2个号码,每个以英文逗号","分隔，例如：1,2,3数-3].bet
        // 和值金额=list[号码].bet
        if (
          ["三星和值", "三星跨度", "三星特码", "三星组选组选"].includes(
            this.value
          )
        ) {
          const reduceNum = this.nums.reduce((total, num) => {
            return total + betList[num].value * 1;
          }, 0);
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.docsListValue = this.divide(reduceNum, false);
          //list[号码].bet 相加
          return this.nums.reduce((total, num) => {
            return total + betList[num].bet * this.multiple;
          }, 0);
        }
        if (
          [
            "三星大小单双",
            "三星波色龙虎和",
            "三星豹子顺子对子",
            "大小单双",
          ].includes(this.value)
        ) {
          const reduceNum = this.nums.reduce((total, num) => {
            const betItem = betList.find((item) => item.txt === num);
            return total + betItem?.value * 1;
          }, 0);
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.docsListValue = this.divide(reduceNum, false);
          return this.nums.reduce((total, num) => {
            const betItem = betList.find((item) => item.txt === num);
            return total + (betItem?.bet || 0) * this.multiple;
          }, 0);
        }
        let cutNum = 0;
        if (["组三", "胆拖"].find((v) => this.value.includes(v))) {
          cutNum = 2;
        } else if (this.value.includes("复式")) {
          cutNum = 3;
        } else if (this.value.includes("组六")) {
          cutNum = 4;
        } else if (this.value.includes("和值")) {
          cutNum = this.nums.length;
        }
        cutNum = this.nums.length - cutNum;
        let docs = betList[cutNum] || {};
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.docsListValue = docs.value;
        return docs.bet * this.multiple || 0;
      }
      return this.divide(
        this.total * this.multiple * this.getPrice(this.value),
        false
      );
    },
    curNav() {
      return this.curTab;
    },
    lastTree() {
      // console.log("this.extractDeepList(this.catTree)", this.extractDeepList(this.catTree));
      return this.extractDeepList(this.catTree);
    },
    betListDocs() {
      return this.lastTree.find((doc) => doc.txt === this.value)?.betList || [];
    },
  },
  mounted() {
    this.position = {
      x: window.innerWidth - 30 - 34,
      y: 440,
    };
    document.body.style.backgroundColor = "#F5F1E5";
   
    this.catList.forEach((item) => {
      if (
        item.id == this.$route.query.id &&
        item.lotteryType == this.$route.query.type
      ) {
        this.nameStr = item.lotteryName;
      }
    });
  },
  methods: {
    closePopup() {
      this.showShopBasket = false;
    },
    startDrag(event) {
      this.isDragging = true;
      this.offset = {
        x: event.touches[0].pageX - this.position.x,
        y: event.touches[0].pageY - this.position.y,
      };
    },
    doMove(event) {
      if (this.isDragging) {
        event.preventDefault();
	  
	    this.position.x = event.touches[0].pageX - this.offset.x;
	    this.position.y = event.touches[0].pageY - this.offset.y;
		
	    // 获取屏幕尺寸，判断客服图标是否在移除框中
	    let lWidth = window.innerWidth - (150 - 70 + 30);
	    let rWidth = window.innerWidth - (150 - 70 - 50 - 30);
	    let tHeight = window.innerHeight - (150 - 65 + 30);
	    let bHeight = window.innerHeight - (150 - 65 - 50 - 30);
		if((lWidth < this.position.x) && (this.position.x < rWidth) && (tHeight < this.position.y) && (bHeight > this.position.y)){
			this.isRemoveChat = true;
			this.chatRemoveImgSize = {
				width: '60px',
				height: '60px',
				marginTop: '-5px',
				marginLeft: '-5px'
			}
			this.chatRemovePanelSize = {
				width: '306px',
				height: '306px',
				right: '-153px',
				bottom: '-153px',
				paddingLeft: '72px',
				paddingTop: '66px',
			}
		}else{
			this.isRemoveChat = false
			
			this.chatRemoveImgSize = chatRemoveImgCss
			this.chatRemovePanelSize = chatRemovePanelCss
		}
		
      }
    },
    stopMove() {
      this.isDragging = false;
	  // 若被移除，则隐藏聊天窗
	  if(this.isRemoveChat){
		  this.isShowChart = false
	  }
    },
    checkLotty() {
      this.showAllLottty = !this.showAllLottty;
    },
    selectOption(item, index) {
      this.chooseLottyType = item.id;
      this.nameStr = item.name;
      this.showAllLottty = false;
    },
    changMul(index) {
      console.log(
        "this.showTotalListArr[index].multiple5",
        this.showTotalListArr[index].multiple
      );

      this.updateTotalMoney(index);
      // console.log("this.showTotalListArr[index].multiple", this.showTotalListArr[index].multiple);
    },
    plusMul(index) {
      this.showTotalListArr[index].multiple++;
      this.updateTotalMoney(index);
    },
    minusMul(index) {
      if (this.showTotalListArr[index].multiple > 1) {
        this.showTotalListArr[index].multiple--;
        this.updateTotalMoney(index);
      }
    },
    updateTotalMoney(index) {
      this.$set(this.showTotalListArr, index, {
        ...this.showTotalListArr[index],
        // totalMoney: (this.showTotalListArr[index].total * this.showTotalListArr[index].multiple * this.showTotalListArr[index].price).toFixed(2)
        totalMoney: parseInt(
          this.showTotalListArr[index].total *
            this.showTotalListArr[index].multiple *
            this.showTotalListArr[index].price
        ),
      });
    },
    delChooseBtn(index) {
      if (this.showTotalListArr.length == 1) {
        this.showTotalListArr = [];
        this.tableList = [];
      } else {
        this.showTotalListArr.splice(index, 1); // 删除数组中的该项
        this.tableList.splice(index, 1); // 删除数组中的该项
      }
    },
    // formatAlltotalMoney(valnum) {
    //   let totalStrNum = 0
    //   let moneyStrNum = 0
    //   for (var i = 0; i < this.showTotalListArr.length; i++) {
    //     totalStrNum = totalStrNum + Number(this.showTotalListArr[i].total)
    //     moneyStrNum = moneyStrNum + Number(this.showTotalListArr[i].totalMoney)
    //   }

    //   if (valnum == 1) {
    //     return totalStrNum
    //   } else {

    //     return moneyStrNum
    //   }
    // },
    changemultiple(v) {
      console.log(v, "v---");
      if (!["三星直选单式", "三星组选组选"].includes(this.value)) return;
      // this.multiple = v;
    },
    changeNav(v) {
      this.curTab = v;
      this.setValue();
    },
    giveTotal(v, n) {
      // console.log("v2323", v, n);
      if (v >= 1) {
        this.showBetNumBool = true;
      } else {
        this.showBetNumBool = false;
      }
      this.total = v;
      console.log(" parseInt(this.total) ", parseInt(this.total));
      console.log(" parseInt(v) ", parseInt(v));
      this.nums = n || [];
      if (parseInt(v) > 0) {
        this.addCache();
      } else {
        this.cacheList = [];
      }
    },
    replaceCat(name, txt) {
      if (!txt) return "";
      if (name === "三星组选") {
        return txt.replace(name, "").replace(this.curNav, "");
      }
      if (name === "大小单双") {
        return txt;
      }
      return txt.replace(this.curNav, "");
    },
    extractDeepList(data) {
      const result = [];

      const traverse = (arr) => {
        arr.forEach((item) => {
          if (item.list) {
            traverse(item.list);
          } else {
            result.push(item);
          }
        });
      };

      traverse(data);
      return result;
    },
    setValue() {
      this.secondNavs.forEach((item, index) => {
        item.list.forEach((v, idx) => {
          if (index === 0 && idx === 0) {
            this.value = v.txt;
          }
        });
      });
    },
    changeCount(v) {
      const { days, hours, minutes, seconds, milliseconds } = v;
      // 转换为总毫秒数
      this.milliseconds =
        days * 24 * 60 * 60 * 1000 +
        hours * 60 * 60 * 1000 +
        minutes * 60 * 1000 +
        seconds * 1000 +
        milliseconds;
    },
    basketClick() {
      if (this.showTotalListArr.length == 0) {
        this.$toast("请先添加选号！");

        return false;
      }
      this.shopBasketName = "购彩篮";
      this.showShopBasket = true;
    },
    sureClick() {
      if (this.showTotalListArr.length == 0) {
        this.$toast("请先添加选号！");
        return false;
      }
      this.shopBasketName = "确认注单";
      this.showShopBasket = true;
    },
    openChase() {
      if (this.checkSingleLimit()) {
        this.$refs.$AppendChase.open({
          multiple: this.multiple, //倍数
          totalALL: this.totalALL, //多数注数
          totalMoney: this.btmMoney, //总金额
        });
      }
    },
    recvMainMultiple(paramItem, paramIndex) {
      this.multiple = paramItem.multiple;
      if (this.cacheList.length > 0) {
        this.cacheList[0].totalMoney =
          this.cacheList[0].price * this.multiple * this.total;
      }
    },
    recvSubMultiple(paramItem, paramIndex) {
      console.log("item2132", paramItem, paramIndex);

      this.$set(this.showTotalListArr, paramIndex, {
        ...this.showTotalListArr[paramIndex],
        ...paramItem,
      });

      console.log("this.showTotalListArr", this.showTotalListArr);
    },
    openChasePop() {
      this.$refs.$AppendChase.open({
        multiple: this.multiple, //倍数
        // totalALL: this.totalALL, //多数注数
        // totalMoney: this.btmMoney, //总金额
        totalALL: this.totalSum, //多数注数
        totalMoney: this.totalMoneySum, //总金额
      });

      this.showShopBasket = false;
    },
    openGroupBuy() {
      if (this.checkSingleLimit()) {
        this.$refs.$BuyTogether.open({
          multiple: this.multiple, //倍数
          totalALL: this.totalSum, //多数注数
          totalMoney: this.totalMoneySum, //总金额
        });
      }

      this.showShopBasket = false;
    },
    pageDell() {
      this.$refs.$cont.clear();
    },
    delALL() {
      this.tableList = [];
      this.showTotalListArr = [];
      this.totalMoneyAccumulated = 0;
    },
    delOne(index) {
      this.tableList.splice(index, 1);
    },
    showTop() {
      this.showBeforeLottery = !this.showBeforeLottery;
      if (this.showBeforeLottery) {
        this.lotteryHisExpect();
      }
    },
    async getPreData(s) {
      console.log("s", s);
      // this.clearTimer(); // 先清除旧的定时器，避免重复创建
      if (s !== "stop") {
        const [err, res] = await userApi.lotteryCurrExpect({ id: this.id });
        if (!err) {
          const { lastExpect } = res.data;
          const cur = this.preData.lastExpect.cycleNum;
          if (cur && lastExpect.cycleNum !== cur) {
            this.preData = res.data;
            await this.getDetail();
          }
        }
      }

      this.tirmr = setTimeout(this.getPreData, 3000);
    },
    clearTimer() {
      if (this.tirmr) {
        clearTimeout(this.tirmr);
        this.tirmr = null;
      }
    },
    async lotteryCurrExpect() {
      const [err, res] = await userApi.lotteryCurrExpect({ id: this.id });
      if (err) return;
      this.preData = res.data;
    },
    setHistory() {
      const storedData = auth.getToken("curDoc");
      if (!storedData) return null;

      const arr = JSON.parse(storedData) || [];
      const curDoc = arr.find((v) => v.id === this.id);
      if (!curDoc) return null;

      const { curNav, value } = curDoc;

      const isHava = this.catTree.some(
        (v) =>
          v.name === curNav &&
          v.list?.some((doc) => doc.list?.some((item) => item.txt === value))
      );

      if (isHava) {
        this.curTab = curNav;
        this.value = value;
        return curDoc;
      }

      return null;
    },

    viewHistory() {
      if (!this.value) return;
      const arr = auth.getToken("curDoc")
        ? JSON.parse(auth.getToken("curDoc"))
        : [];
      const curDoc = {
        id: this.id,
        curNav: this.curTab,
        value: this.value,
      };
      // arr 根据id 查找，没有就插入以后就修改
      const index = arr.findIndex((v) => v.id === this.id);
      if (index === -1) {
        arr.push(curDoc);
      } else {
        arr[index] = curDoc;
      }
      //arr 保留最新20条
      if (arr.length > 20) {
        arr.shift();
      }
      auth.setToken(JSON.stringify(arr), "curDoc");
    },
    async getDetail() {
      const [err, res] = await userApi.betsDetail({ id: this.id });
      if (err) return;
      this.catTree = JSON.parse(res.data.mulConfig);
      res.data.mulConfig = JSON.parse(res.data.mulConfig);
      console.log(this.catTree);
      //value
      if (!res.data.nextExpect) {
        res.data.nextExpect = {};
      }
      this.detail = res.data;
      const curDoc = this.setHistory();
      if (!curDoc) {
        this.curTab = this.catTree[0]?.name;
        this.setValue();
      }
    },
    initDetail() {
      // this.getDetail();
      // this.lotteryCurrExpect();
      return Promise.all([this.getDetail(), this.lotteryCurrExpect()]);
    },
    async lotteryHisExpect() {
      const [err, res] = await userApi.lotteryHisExpect({
        pageNo: 1,
        pageSize: 10,
        id: +this.id,
      });
      if (err) return;
      this.tableData = res.data;
    },
    closeContDialog() {
      this.$refs.$BetOn?.close();
      this.$refs.$AppendChase?.close();
      this.$refs.$BuyTogether?.close();
    },
    buySuccess() {
      this.delALL();
      this.closeContDialog();
      this.multiple = 1;
    },
    openFish() {
      this.closeContDialog();
      // console.log("this.detail.nextExpect.nextExpect", this.detail.nextExpect.nextExpect);
      this.$refs.$finshDialog.open(
        `当前期数【${this.detail.nextExpect.nextExpect}】已停止下注，是否清空已投注内容？`
      );
      this.showSelect = false;
      this.showBeforeLottery = false;
    },
    clearData() {
		this.showShopBasket = false;
		this.closeContDialog()
		this.showTotalListArr = [];
		this.tableList = [];
    },
    badge() {
      if (!this.tableList.length) {
        this.$toast("请先选择投注");
        return;
      }
      this.$refs.$BetOn.open();
    },
    randem() {
      this.$refs.$cont?.randem();
      this.$nextTick(() => {
        this.add();
      });
    },
    async sure() {
      if (this.checkSingleLimit()) {
        await this.ajaxPay(this.$util.getStrs(this.showTotalListArr));
      }
    },
    // 检查单次是否超过下注上限
    checkSingleLimit() {
      if (this.showTotalListArr.length === 0) {
        this.$toast("请先添加选号");
        return false;
      }
      // 将tableList 按照model来统计total
      const totalMap = {};
      this.showTotalListArr.forEach((v) => {
        if (totalMap[v.model]) {
          totalMap[v.model] += v.total;
        } else {
          totalMap[v.model] = v.total;
        }
      });
      // 检查投注限额
      const checkLimit = (betConfig) => {
        for (const group of betConfig) {
          for (const item of group.list) {
            for (const betItem of item.list) {
              // 当limit为0时表示无限制，跳过检查
              if (
                betItem.limit !== 0 &&
                totalMap[betItem.txt] > betItem.limit
              ) {
                this.$toast(`${betItem.txt}投注已达上限`);
                return false;
              }
            }
          }
        }
        return true;
      };
      return checkLimit(this.catTree);
    },
    async ajaxPay(v) {
      this.$toast.loading({ duration: 0, message: "投注中..." });
      const [err] = await userApi.lotteryBet({
        lotteryId: this.id,
        betCode: v,
      });
      if (err) return;
      this.multiple = 1;
      this.buySuccess();
      this.showShopBasket = false;
      this.$toast("投注成功");
    },
    getPrice(v) {
	  let item = this.lastTree.find((doc) => doc.txt === v);
      return item?.bet || item?.betList[0].bet || 2;
    },
    addCache() {
      const price = this.getPrice(this.value);
      this.cacheList = [
        {
          model: this.value,
          text: this.$refs.$cont.text,
          total: this.total,
          multiple: this.multiple,
          price: this.theOne.includes(this.value) ? this.totalMoney : price,
          totalMoney: this.totalMoney,
        },
      ];
      // this.$refs.$cont.clear();
    },
    add() {
      const status = this.$refs.$cont.add();
      if (!status) {
        return;
      }
      // console.log("this.value", this.value);
      const price = this.getPrice(this.value);
      this.totalNum = this.totalNum + parseInt(this.total);
      this.totalMoneyAccumulated =
        this.totalMoneyAccumulated + Number(this.totalMoney);
		
      this.tableList.push({
        model: this.value,
        text: this.$refs.$cont.text,
        total: this.total,
        multiple: this.multiple,
        price: this.theOne.includes(this.value) ? this.totalMoney : price,
        totalMoney: parseInt(this.totalMoney),
      });
      this.multiple = 1;

      this.showTotalListArr = [...this.tableList];
      console.log("showTotalListArr", this.showTotalListArr);
      this.$toast("添加成功");
      //body滑动底部
      // this.$nextTick(() => {
      //   window.scrollTo(0, document.body.scrollHeight);
      // });
      this.$refs.$cont.clear();
      this.cacheList = [];
    },
  },
  async created() {
    this.showTotalListArr = [];
    await this.initDetail();
    this.getPreData("stop");
  },
  beforeDestroy() {
    document.body.style.backgroundColor = "";
    console.log("beforeDestroy");
    // this.clearTimer();
    this.tirmr && clearTimeout(this.tirmr);
  },

  deactivated() {
    // keep-alive 缓存组件时，deactivated 会触发
  },
};
</script>
<style scoped lang="less">
.app-top-bar {
  .center-box {
    position: fixed;
    top: 90px;
    left: 0;
    width: 100%;
    height: calc(100% - 90px);
    display: flex;
    align-items: flex-end;

    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
    }

    .select-box {
      position: relative;
      background: #fff;
      padding: 40px 34px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 40px;
      width: 100%;

      .select {
        width: 200px;
        height: 68px;
        text-align: center;
        line-height: 68px;
        border: 1px solid #999999;
        border-radius: 14px;
        color: #666666;
        font-size: 28px;
        overflow: hidden;

        &.on {
          color: #bf2935;
          border: 1px solid #bf2935;
          position: relative;

          &::after {
            content: "";
            position: absolute;
            background: url("@/assets/img/Welfare3D/dui.png") no-repeat;
            background-size: 100% auto;
            width: 36px;
            height: 36px;
            right: -1px;
            bottom: -1px;
          }
        }
      }
    }
  }

  .right-box {
    width: 100px;
    font-size: 48px;
    position: relative;

    .more-pop {
      position: absolute;
      right: 20px;
      top: 0.9rem;
      z-index: 99;
      background: #fff;
      border-radius: 6px 6px 6px 6px;
      box-shadow: 0px 6px 12px 2px rgba(0, 0, 0, 0.16);
      color: #666666;
      display: flex;
      font-size: 28px;
      align-items: center;
      padding: 24px 24px;

      .text {
        width: 400px;
      }

      .js-icon {
        background: url("@/assets/img/Welfare3D/js-icon.png") no-repeat;
        background-size: 100% auto;
        width: 48px;
        height: 48px;
        margin-right: 14px;
      }

      .top-icon {
        position: absolute;
        top: -25px;
        right: 8px;
        transform: rotate(-90deg);
        font-size: 40px;
      }
    }
  }
}

.open-result {
  height: 112px;

  .content {
    height: 100%;
  }
}

.before-lottery {
  .lists {
    display: flex;
    height: 64px;
    background: #fff;
    padding: 0 28px;
    line-height: 64px;
    font-size: 24px;

    &:nth-child(2n) {
      background: #f9f9f9;
    }
  }

  .left {
    text-align: center;
  }

  .right {
    flex: 1;
    display: flex;
    justify-content: end;

    .num-box {
      flex: 1;
      text-align: center;
      color: #bf2935;
      font-size: 36px;
      font-weight: 600;
      display: flex;
      justify-content: center;

      .num {
        width: 50px;
        text-align: center;
      }
    }

    .time {
      text-align: center;
    }
  }
}

.singleBet {
  margin-right: 26px;

  .text {
    color: #e50012;
  }
}

::v-deep(.van-stepper__input) {
  margin: 0;
  border-left: 1px solid #d2d2d2;
  border-right: 1px solid #d2d2d2;
  background-color: #fff;
}

::v-deep(.van-stepper) {
  border: 1px solid #d2d2d2;
  border-radius: 12px !important;
  overflow: hidden;
  background-color: #fff;
}

::v-deep(.van-stepper__plus) {
  background-color: #fff;
}

::v-deep(.van-stepper__minus) {
  background-color: #fff;
}

.periods-box {
  display: flex;
  height: 100px;
  align-items: center;
  padding: 0 28px;
  background: #fff;

  .left {
    flex: 1;
  }

  .right {
    display: flex;
    align-items: center;

    .time {
      color: #bf2935;
      // margin-right: 36px;
    }

    .icon {
      font-size: 40px;
    }
  }
}

.main-wrap {
  padding: 240px 0 0;

  .des-box {
    display: flex;
    align-items: center;
    padding: 0 28px;

    .left {
      flex: 1;
      font-size: 24px;
      color: #242424;
    }

    .right {
      color: #b18600;

      .ramd {
        width: 32px;
        height: 32px;
      }
    }
  }

  .xuan-box {
    .xuan-list {
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      padding: 40px 28px;

      .left {
      }

      .right {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
      }

      .item {
        margin-right: 30px;
        margin-bottom: 26px;

        &.small {
          margin-right: 30px;

          .num-top {
            color: #fff;
            font-weight: 400;
            font-size: 28px;
            min-width: 90px;
            padding: 0 8px;
            border-radius: 60px;
          }
        }

        .num-top {
          border: 2px solid #bf2935;
          height: 60px;
          line-height: 60px;
          font-weight: bold;
          font-size: 32px;
          color: #bf2935;
          min-width: 60px;
          text-align: center;
          border-radius: 100%;

          &.on {
            background: #bf2935;
            color: #fff;
          }
        }

        .num-bottom {
          font-size: 24px;
          color: #999999;
          text-align: center;
          margin-top: 24px;
        }
      }
    }
  }

  .tips-box {
    padding: 36px 28px;

    .t2 {
      color: #999999;
      margin-top: 8px;
    }
  }
}

.downs-box {
  background-color: #fff;
  position: relative;
  z-index: 2;
  max-height: 90%;
  overflow-y: auto;

  .desc {
    font-size: 36px;
    color: #0b0909;
    text-align: left;
    padding-left: 34px;
  }
}

.betting-box {
  .height {
    height: 98px;
  }

  .fixed {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    // background: #fff;
  }

  .fixed-btm {
    height: 148px;
    background: #242424;

    .btnTool {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 0 20px 0 26px;
      width: 100%;

      & > div {
        border-radius: 16px;
        font-family: PingFang HK, PingFang HK;
        font-weight: 400;
        font-size: 24px;
        color: #000000;
        text-align: center;
        font-style: normal;
        text-transform: none;
        background: #ffffff;
        height: 96px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        padding: 0 12px;
      }

      .nearBet {
        width: 94px;
        height: 90px;
        letter-spacing: 2px;
      }

      .haveIcon {
        max-width: 140px;

        .toolicon {
          img {
            width: 30px;
            height: 30px;
          }
        }

        .text {
        }
      }

      .betBtn {
        background: linear-gradient(180deg, #ca404b 0%, #bf2935 100%);
        color: #fff;
        width: 330px;
        justify-content: space-around;

        .nowText {
          font-family: PingFang HK, PingFang HK;
          font-weight: 400;
          font-size: 28px;
          color: #ffffff;
          text-align: center;
          font-style: normal;
          text-transform: none;
        }

        .moneyNum {
          font-family: PingFang HK, PingFang HK;
          font-weight: 400;
          font-size: 28px;
          color: #feedaf;
          text-align: center;
          font-style: normal;
          text-transform: none;
        }
      }

      .sureDisplay {
        background: linear-gradient(to bottom, #ca404b, #bf2935);
        opacity: 0.5;
        color: #fff;

        .nowText {
          color: #ffffff;
        }
      }

      .continueBtn {
        // margin-left: 12px;
        width: 116px;
        font-size: 28px;
        letter-spacing: 2px;
      }
    }
  }

  .fixed-up {
    background-color: #f8f8f8;
    height: 90px;
    padding: 0 38px;

    .clearBox {
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 32px;
        height: 32px;
        // vertical-align: middle;
      }

      span {
        margin-left: 2px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 24px;
        color: #575858;
        text-align: center;
        font-style: normal;
        text-transform: none;
      }
    }
  }

  .total-all {
    text-align: left;
    padding: 0 24px;
    justify-content: flex-start !important;
    margin: 0 auto 18px;
    width: max-content;
    // width: 292px;
    height: 54px;
    background: #3f3a3a;
    border-radius: 26px;

    .t1,
    .t2 {
      font-family: PingFang HK, PingFang HK;
      font-weight: 400;
      font-size: 24px;
      color: #ffffff !important;
      text-align: center;
      font-style: normal;
      text-transform: none;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 0 !important;

      span {
        font-size: 28px;
      }

      .betIcon {
        width: 36px;
        height: 36px;
        // margin-top: 4px;
        margin-left: 10px;
      }
    }
  }

  .left {
    text-align: center;
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;

    .del-icon {
      background: url("@/assets/img/Welfare3D/del.png") no-repeat;
      background-size: 100% auto;
      width: 44px;
      height: 44px;
    }

    .text {
      font-size: 22px;
      color: #cccccc;
      margin-top: 2px;
    }

    &::after {
      content: "";
      position: absolute;
      right: 0;
      top: 10px;
      width: 1px;
      height: 60px;
      background: #e5e5e5;
    }
  }

  .center {
    // flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666666;

    .t2 {
      color: #bf2935;
      margin-left: 16px;
    }
  }

  .right {
    width: 180px;
    line-height: 98px;
    background: #bf2935;
    color: #fff;
    font-size: 32px;
    text-align: center;
  }
}

.header-desc {
  background-color: #e0d9bd;
  position: fixed;
  width: 100%;
  top: 90px;
  z-index: 888;

  .center-box {
    position: fixed;
    top: 90px;
    left: 0;
    width: 100%;
    height: calc(100% - 90px);
    display: flex;
    align-items: flex-end;

    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
    }

    .select-box {
      position: relative;
      background: #fff;
      padding: 40px 34px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 40px;
      width: 100%;

      .select {
        width: 200px;
        height: 68px;
        text-align: center;
        line-height: 68px;
        border: 1px solid #999999;
        border-radius: 14px;
        color: #666666;
        font-size: 28px;
        overflow: hidden;

        &.on {
          color: #bf2935;
          border: 1px solid #bf2935;
          position: relative;

          &::after {
            content: "";
            position: absolute;
            background: url("@/assets/img/Welfare3D/dui.png") no-repeat;
            background-size: 100% auto;
            width: 36px;
            height: 36px;
            right: -1px;
            bottom: -1px;
          }
        }
      }
    }
  }

  ul {
    width: 50%;

    &:first-child {
      border-right: 1px solid #bbb48f;
      /* 右边框 */
      border-top: none;
      border-left: none;
      border-bottom: none;
    }

    .text_name {
      font-family: PingFang SC, PingFang SC;
      font-weight: 1000;
      font-size: 26px;
      color: #242424;
      text-align: left;
      font-style: normal;
      text-transform: none;
      margin-bottom: 10px;
    }

    .text_ex_name {
      font-family: PingFang SC, PingFang SC;
      font-weight: 1000;
      font-size: 26px;
      color: #242424;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}

.header-desc {
  color: #ccc;
  top: 88px;
  .head-game {
    background: #202521;
    padding-top: 6px;
    padding-bottom: 20px;
  }
}

.chose-ball {
  width: 48px;
  height: 48px;
  // background: linear-gradient(to bottom, #BF2935, #F72F3F);
  border-radius: 50%;

  background: linear-gradient(to bottom, #f72f3f, #bf2935);
  /* 渐变背景 */
  box-shadow: 0px 4px 2px 2px rgba(0, 0, 0, 0.16);
  /* 边框颜色 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  color: white;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);

  &:not(:first-child):not(:last-child) {
    margin-left: 12px;
    margin-right: 12px;
  }

  /* 如果前一个 .chose-ball 已经设置了 margin-right，则当前元素去掉 margin-left，防止双重间距 */
  &:not(:first-child):not(:last-child) + & {
    margin-left: 0;
  }
}

.chose-ball-list {
  justify-content: flex-end;
  margin-top: 4px;
}

.bet-tip {
  color: #242424;
  font-size: 26px;
  font-weight: 500;
}

.timeData {
  line-height: 1;

  & > span {
    // margin-right: 16px;
  }

  .colon {
    // padding-bottom: 12px;
    color: #242424;
    font-size: 36px;
    font-weight: 1000;
  }

  .block {
    // min-width: 42px;
    height: 42px;
    // background: #000000;
    border-radius: 6px 6px 6px 6px;

    font-family: PingFang SC, PingFang SC;
    font-weight: 1000;
    font-size: 36px;
    color: #242424;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
}

.bets-desc {
  .clear-list {
    width: 296px;
    height: 78px;
    background: linear-gradient(180deg, #999999 0%, #4d4d4d 100%);
    border-radius: 16px 16px 16px 16px;
  }

  .add-list {
    width: 374px;
    height: 78px;
    background: linear-gradient(180deg, #00b6c3 0%, #006d76 100%);
    border-radius: 16px 16px 16px 16px;
  }
}

.orders-list {
  padding: 0 28px;
  margin-top: 44px;

  .orders-cont {
    min-height: 208px;
    background: #ececec;
  }

  & > li:first-child {
    color: #0d0d0d;
    position: relative;
    height: 20px;
    padding-left: 20px;
    height: 44px;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 10px;
      height: 44px;
      background: #e50012;
      border-radius: 0px 0px 0px 0px;
    }
  }

  .orders-item {
    overflow-x: auto;

    & > span:first-child {
      //width: 200px;
    }
  }
}

.bets-way {
  padding: 0 28px;

  & > li {
    height: 96px;
    border-bottom: 1px solid #ececec;
  }
}

.together {
  position: fixed;
  right: 30px;
  bottom: 440px;

  .group-btn {
    width: 100px;
    height: 100px;
  }

  .room-enter {
    .d-img {
      width: 64px;
      height: 64px;
    }

    // li:first-child {
    //   width: 100px;
    //   height: 100px;
    // }

    // li:last-child {
    //   width: 40px;
    //   height: 40px;
    // }

    .chatRoom {
      width: 64px;
      height: 64px;
    }
  }
}

.overHidden {
  overflow: hidden;
}

.c-page {
  overflow-x: hidden;
  padding-bottom: 320px;
  position: relative;
  background: #f5f1e5;

  height: calc(100vh - 4.26667rem);
}

.txt {
  margin-right: 20px;
  width: 10px;
  position: fixed;
  left: 170px;
}

.title-desc {
  padding-left: 16px;
  padding-right: 8px;
  min-width: 214px;
  height: 52px;
  line-height: 1;
  border-radius: 12px 12px 12px 12px;
  border: 2px solid #ffffff;

  .downd {
    width: 30px;
    height: 30px;
  }
}

.balance {
  float: right;
  // margin-right: 20px;
  position: fixed;
  display: inline-block;
  vertical-align: middle;
  /* 垂直居中对齐 */
  right: 16px;

  .value {
    color: #feedaf;
  }

  .downd {
    width: 28px;
    height: 28px;
    margin-top: -4px;
    vertical-align: middle;
    /* 确保图片也垂直居中 */
  }
}

.van-list {
  z-index: 0;
  height: 420px;
  overflow-y: auto;
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;

  /* IE 10+ */
  // padding: 32px 0;
  /* 添加内边距 */
  .title {
    font-size: 28px;
    font-weight: bold;
  }
}

.basketContanier {
  position: relative;

  .head {
    width: 100%;
    padding: 40px 46px 40px 38px;
    border: 1px solid #e5e5e5;
    color: #000;
    background-color: #fff;

    img {
      width: 32px;
      height: 32px;
    }

    .centerTitle {
      font-size: 32px;
      font-family: PingFang HK, PingFang HK;
    }

    .rigbtn {
      font-size: 24px;
    }
  }

  .content {
    position: relative;
    width: 100%;
    padding: 16px 36px;
    height: 440px;
    overflow: hidden;

    .chooseItem {
      width: 100%;
      background: #fafafa;
      border-radius: 24px;
      padding: 20px 20px;
      margin-bottom: 16px;

      .line1 {
        width: 100%;

        .delBtn {
          width: 32px;
          height: 32px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .line2 {
        width: 100%;

        span {
          color: #ff8400;
        }
      }

      .line3 {
        width: 100%;
      }
    }
  }

  .bottom {
    //    z-index: 1;
    //    width: 100%;
    //    padding: 34px 20px 34px 34px;
    //    box-shadow: 6px 0px 12px 2px rgba(0, 0, 0, 0.16);
    //    background-color: #FFF;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 158px;
    background: #fff;
    box-shadow: 6px 0px 12px 2px rgba(0, 0, 0, 0.16);

    padding: 0 20px;

    .leftContent {
      font-size: 24px;

      .numText {
        color: #ff8400;
      }

      .bottomCon {
        margin-top: 10px;
      }
    }

    .btnBetTool {
      .zhbtn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 126px;
        height: 90px;
        background: #ffdee1;
        border-radius: 12px;
        border: 2px solid #bf2834;
        font-size: 30px;
        color: #e50012;
      }

      .tzbtn {
        margin-left: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 126px;
        height: 90px;
        border-radius: 12px;
        background: #bf2935;
        font-size: 30px;
        color: #fff;
      }
    }
  }
}

.movable-div {
  width: 64px;
  height: 64px;
  cursor: pointer;
  z-index: 9999;
}
.delChatPanel{
	position: fixed;
	width: 600px;
	height: 600px;
	border-radius: 100%;
	bottom: -300px;
	right: -300px;
	background-color: #eb5353;
	padding-left: 140px;
	padding-top: 130px;
	.logo{
		width: 100px;
		height: 100px;
	}
}
</style>
