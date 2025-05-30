<template>
  <div class="opens-list">
	<div class="num">
		<p class="tops font12 ">
		  近期开奖记录
		</p>
	</div>
	<div class="content font9">
		<div class="item" v-for="(item, index) in data.opens" >
		  <div class="betName">
			  <span>{{item.cycleNum}}</span>
		  </div>
		  <div style="float: right;">
			  <!-- <span>{{$betName(item.openNum) }}</span> -->
			  <div class="hisBets hisBets_p font13" v-if="item.openNum">
			  	<div class="betVal center-center">
			  	  <p
			  	    class="openbets center-center"
			  	    :class="[
			  	      'openbets' + '0',
			  	      
			  	    ]"
			  	  >
			  	    <span class="ball-inner">{{ $betName(item.openNum) }}</span>
			  	  </p>
			  	</div>
			  </div>
		  </div>
		  
		</div>
	</div>
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
.hisBets{
	// width: 100%;
	
	border-radius: 10px;
	display: flow-root;
	margin: 0px 0.4rem;
	// padding: 20px 0;
	.name{
		width: 50%;
		float: left;
		text-align: center;
	}
	.betVal{
		float: left;
		text-align: left;
		color:#fff;
		justify-content: left !important;
		// margin-top: 10px;
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
::v-deep .van-overlay{
	background-color: rgba(161, 159, 163, 0.3);
}
</style>
