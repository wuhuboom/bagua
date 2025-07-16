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
        class="top-bets-cont flex-column justify-around font13"
      >
        <ul class="justify-between p-l-8 p-r-8">
		  
		  <li class="align-center">
		    <div class="flex-column align-center">
			  <!-- <p class="rightExpect colorfff">{{ detail.nextExpect.nextExpect }}期</p> -->
		      <div class="timeData" v-if="detail.nextExpect.countdown==-1&&detail.nextExpect.stopTime==-1">
				  未开盘
			  </div>
			  <div class="timeData" v-else-if="detail.nextExpect.countdown<0&&detail.nextExpect.stopTime>0">
			  	  封盘中
			  </div>
			  <van-count-down v-else :time="detail.nextExpect?.countdown * 1000">
		        <template #default="timeData">
		          <div class="colorfff timeData align-center">
		            <span class="block center-center">{{
		              timeData.hours >= 10
		                ? timeData.hours
		                : `0${timeData.hours}`
		            }}</span>:
		            <span class="block center-center">{{
		              timeData.minutes >= 10
		                ? timeData.minutes
		                : `0${timeData.minutes}`
		            }}</span>:
		            <span class="block center-center">{{
		              timeData.seconds >= 10
		                ? timeData.seconds
		                : `0${timeData.seconds}`
		            }}</span>
		          </div>
		        </template>
		      </van-count-down>
		      
		    </div>
		  </li>
          <li class="d-flex ">
            <div class=" align-center">
          
              <div class="sendBox">
                <p class="center-center colorfff moneyLeft" @click="checkMoney">
                  余额
                  <img
                    class="d-img"
                    src="@/assets/img/uneye.png"
                    alt=""
                    v-if="showBlance"
                  />
                  <img
                    class="d-img"
                    src="@/assets/img/ableeye.png"
                    alt=""
                    v-if="!showBlance"
                  />
                </p>
				<p class="font13 colorfff">
					<span>{{ showBlance ? divide(user.balance) : " *****" }}</span>
				</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- 上拉 -->
      <!-- <p class="slides" :class="{ slidesclose: !head }" @click="toggleHead"></p> -->
    </div>
	
	<!-- <div class="hisBets hisBets_p font13">
		<div  @click="openHis()">
			<div class="name"> 第{{ prize.cycleNum }}期开奖</div>
			<div class="betVal betVal_width center-center">
			  <p
			    v-for="(v, i) in prize.openArr"
			    class="openbets center-center"
			    :class="[
			      'openbets' + i,
			      { 'm-r-4': i != prize.openArr.length - 1 },
			    ]"
			    :key="i"
			  >
			    <span class="ball-inner">{{ $betName(v) }}</span>
			  </p>
			  <i v-if="!showother" class="iconfont iconName icon-jiantou34 color-000"></i>
			  <i v-else class="iconfont iconName icon-jiantou32 color-000"></i>
			</div>
		</div>
		
	</div> -->
	<div ref="popup" >
	  <div v-if="showother" class="other-prize-box">
		  <table border="1" class="tb_nav">
		    <tr>
		      <th class="tb_th">期号</th>
		      <th class="tb_th">开奖时间</th>
		      <th class="tb_th">开奖结果</th>
		    </tr>
		    <tr
		  	v-for="(item, i) in otherPrize"
		  	:key="i"
		    >
		      <td class="tb_td tb_td_1">
		  		{{ item.cycleNum }}
		  	</td>
		      <td class="tb_td tb_td_2">
		  	{{ $dayjsSingleTime(item.openTime) }}
		  	</td>
		    <td class="tb_td hisBets">
		  		<!-- {{ item.openNum }} -->
				<div class="betVal center-center">
				  <p
				    v-for="(v, i) in item.openNum.split(',')"
				    class="openbets center-center"
				    :class="[
				      'openbets' + i,
				      { 'm-r-4': i != prize.openArr.length - 1 },
				    ]"
				    :key="i"
				  >
				    <span class="ball-inner">{{ $betName(v) }}</span>
				  </p>
				</div>
		  	</td>
		    </tr>
		  </table>
		  <div class="showMore"  @click="closeHis()">
			  收起
		  </div>
	   <!-- <ul
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
	    </ul> -->
	  </div>
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
      showBlance: false,
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
    user() {
      // console.log('news', this.news);
      return this.$store.state.user;
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
    checkMoney() {
      this.showBlance = !this.showBlance;
    },
	openHis(){
		this.showother = !this.showother
		console.log(this.showother)
	},
	closeHis(){
		console.log(8888)
		this.showother = false
	},
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
      const [err, res] = await userApi.betsDetail();
      if (err) return;
      //value
      if (!res.data.nextExpect) {
        res.data.nextExpect = {};
      }
	  this.$emit("expect", res.data.nextExpect);
      if (
        this.detail.id !== res.data.id ||
        this.detail.nextExpect.nextExpect !== res.data.nextExpect.nextExpect
      ) {
        this.detail = res.data;
        this.lotteryBetsOrder();
      }
    },

    handleClickOutside(event) {
      // 如果弹框存在并且点击不在弹框内部
      if (
        this.showother &&
        this.$refs.popup &&
        !this.$refs.popup.contains(event.target)
      ) {
        // if (event.target.innerHTML != "往期") {
        //   this.showother = false;
        // }
      }
    },
  },
  created() {
    // this.id = +sessionStorage.getItem("lotteryId") || +this.catList[0].id;
	this.getDetail();
    // getDetail d定时检查
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

@media (min-width: 500px) {
  .chat-top-bets {
	margin: auto auto;
	padding-top: 0px;
	position: initial;
  }
  .top-bets-bot{
	padding: .32rem 0;
  }
}
.top-bets-bot{
	padding: .06rem 0;
	margin: 0 .4rem .2rem .4rem;
	// width: 9.06667rem;
	border-radius: .13333rem;
	display: -webkit-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-pack: justify;
	-webkit-justify-content: space-between;
	-ms-flex-pack: justify;
	justify-content: space-between;    
	background-image: linear-gradient(0deg,#4f8dfe,#4f9dfe),linear-gradient(#4f8dfe,#4f8dfe);
}
.top-bets-cont{
	width:100%;
	.d-flex{
		border-left: 2px solid #fff;
	}
	li{
		width: 50%;
		text-align: center;
		.justify-between{
			width: 100%;
		}
		
		.align-center{
			width: 100%;
			text-align: center;
		}
		.sendBox{
			width: 100%;
			
		}
		.timeData{
			background-color: #fff;
			color: #000;
			padding: 2px 10px;
			border-radius: 6px;
		}
	}
	
	.moneyLeft {
	  margin-left: -20px;
	  font-family: PingFang SC, PingFang SC;
	  font-weight: 400;
	  // font-size: 24px;
	  color: #ffffff;
	  text-align: center;
	  font-style: normal;
	  text-transform: none;

	  img {
		width: 28px;
		height: 28px;
		margin-left: 6px;
	  }
	  
		@media (min-width: 500px) {
		  img {
		  		width: 112px;
		  		height: 112px;
		  		margin-left: 24px;
		  }
		}
	}
}
.hisBets_p{
	padding: 20px 0;
}
.hisBets{
	// width: 100%;
	display: flow-root;
	margin: 0px 0.4rem;
	padding: 10px 0;
	.name{
		width: 50%;
		float: left;
		text-align: center;
	}
	.betVal{
		// float: left;
		// text-align: left;
		color: #fff;
		// justify-content: left !important;
		// margin-top: 10px;
	}
	.betVal_width{
		width: calc(50% - 0.8rem);
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
}
.color-000{
	color: #000;
}
.showMore{
	width: 100%;
	height: 60px;
	line-height: 60px;
	text-align: center;
	font-size: 24px;
	border-top: 2px solid #e0e0e0;
}
.tb_nav{
	width:100%;
	border-width: 0;
	.tb_th{
		margin: 0 0;
		width: 25%;
		border-width: 0;
		padding:5px 10px;
		text-align: center;
		font-size: 20px;
		background-color: #f3f3f6;
	}
	.tb_td{
		font-size: 24px;
		border-width: 0;
		text-align: center;
		.btn{
			border-radius: 10px;
			padding: 8px 20px;
			color: #fff;
			border: 2px solid rgb(2, 127, 0);
			background-color: rgb(2, 127, 0);	
		}
	}
	.tb_td_1 {
		// color:rgb(3, 101, 100);
	}
	.tb_td_2 {
		// color:rgb(215, 118, 0)
	}
}
</style>
