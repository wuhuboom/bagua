<template>
  <div class="opens-list">
	<div class="num font13">
		<!-- <p class="tops font12 ">
		  第{{ data.expect }}期玩家竞猜账单
		</p> -->
		<p class="tops font13 ">
		  本期玩家竞猜账单
		</p>
	</div>
	<div class="content font13">
		<div class="item" v-for="(item, index) in data" @click="open(item)">
		  <div class="betName">
			  <span>{{item.name}}</span>
		  </div>
		  <div style="float: right;">
			  <i class="iconfont iconName icon-jiantou34"></i>
		  </div>
		  
		</div>
	</div>
	
	<van-popup
	  class="modal"
	  v-model="showOpen"
	>
	  <div class="modal-header">
	    <div class="modal-title font13">
			<div style="float: left;">{{cur.name}}下注详情</div>
			<div style="float: right;">{{cur.money}}</div>
		</div>
	    <div class="modal-subtitle font13">
			<div v-for="(item,index) in cur.data" :key="index" class="item">
				<div class="code">{{item.code}}</div>
				<div style="float: right;">{{item.money}}</div>
			</div>
		</div>
	  </div>
	</van-popup>
  </div>
</template>

<script>
export default {
  name: "imgMsg",
  data() {
    return {
      showOpen: false,
	  cur: {}
    };
  },
  props: {
    doc: {
      type: Object,
      default: () => {},
    },
    userPic: {
      type: String,
      default: "",
    },
  },
  computed: {
    data() {
      return this.doc.data;
    },
  },
  methods: {
	  open(item){
		  this.showOpen = true;
		  this.cur = item
	  }
  },
  mounted() {
    // console.log(this.doc);
  },
};
</script>
<style scoped lang="scss">
.opens-list {
  background-color: #fff;
  border-radius: 6px;
  width: 55vw;
  .num{
	padding: 10px 18px;
	line-height: 50px;
	// background-color: #62b6f8;
	border-bottom: 2px solid #e0e0e0;
	border-top-left-radius: 6px;
	border-top-right-radius: 6px;
  }
  .content{
	  padding: 20px;
	  .item{
		  margin: 2px 4px;
		  height: 46px;
		  padding: 0 4px;
		  
		  
		  // display: flex;
		  // align-items: center;
		  // justify-content: center;
		  background-color: #eceaed;
		  // flex: 1 1 33.333%;
		  // box-sizing: border-box;
		  .betName{
			float: left;
			line-height: 46px;
		  }
	  }
  }
}

.doc-line {
  //虚线
  border-top: 1px dashed #62b6f8;
}
.modal{
	width: 50vw;
	border-radius: 10px;
	/* 上半部分白底区域 */
	.modal-header {
	  text-align: center;
	  // padding: 20px 10px 10px;
	  // background: linear-gradient(to bottom, #fff, #fefefe);
	}
	.redImg {
	  width: 84px;
	  height: 84px;
	  margin-top: 34px;
	}
	
	.modal-title {
	  width: 100%;
	  height: 60px;
	  font-size: 24px;
	  padding: 0px 16px;
	  line-height: 60px;
	  text-align: left;
	  color: #000;
	  font-style: normal;
	  text-transform: none;
	  border-bottom: 2px solid #e0e0e0;
	}
	
	.modal-subtitle {
	  padding: 10px 16px;
	  font-size: 24px;
	  color: #000;
	  text-align: center;
	  font-style: normal;
	  text-transform: none;
	  .item{
		  height: 50px;
		  line-height: 50px;
		  .code{
			  color:#3291FF;
			  float: left;
		  }
	  }
	}
	
	.modal-detail {
	  font-family: Roboto, Roboto;
	  font-weight: 400;
	  font-size: 24px;
	  padding-top: 126px;
	  color: #feedaf;
	  text-align: center;
	  font-style: normal;
	  text-transform: none;
	}
	.double-arrow {
	  width: 20px;
	  height: 30px;
	  fill: none;
	  stroke: white;
	  opacity: 0.8;
	  vertical-align: text-bottom;
	}
	
}
@media (min-width: 500px) {
	.opens-list {
		border-radius: 18px !important;
		width: 21vw !important;
		.num{
			padding: 20px 36px;
			line-height: 120px;
			// background-color: #62b6f8;
			border-bottom: 4px solid #e0e0e0;
			border-top-left-radius: 18px;
			border-top-right-radius: 18px;
		}
		.content{
			  padding: 60px;
			  .item{
				  margin: 8px 8px;
				  height: 160px;
				  padding: 0 16px;
				  .betName{
					line-height: 160px;
				  }
			  }
		}
	}
	.modal{
		width: 21rem !important;
		border-radius: 30px !important;
		.modal-title {
		  width: 100%;
		  height: 180px;
		  padding: 0px 50px;
		  line-height: 180px;
		  border-bottom: 4px solid #e0e0e0;
		}
		
		.modal-subtitle {
		  padding: 20px 50px;
		  .item{
			  height: 160px;
			  line-height: 160px;
		  }
		}
		
	}
}
::v-deep .van-overlay{
	background-color: rgba(161, 159, 163, 0.3);
}
</style>
