<!-- eslint-disable prettier/prettier -->
<template>
  <div class="video flex-column">
    <AppTopBar class="app-top-bar" topBarTitle="历史视频" :showLeft='showBack'> </AppTopBar>
	<div class="list">
		<div class="item" v-for="(item, index) in videoList" :key='index' @click="open(item.data)">
			<img src="@/assets/img/tg_image.png">	
			<!-- <img :src="item.img"> -->
			<div class="font13">
				{{ $dayjsTime(item.time) }}
			</div>
		</div>  
	</div>  
  </div>
</template>

<script>
import userApi from "@/api/user";
import Notice from "@/components/Notice";
import auth from "@/plugins/auth";
const initForm = () => ({
  username: "",
  password: "",
  code: "",
  verifyKey: "",
  from: 1,
});
export default {
  name: "AppLogin",
  data() {
    return {
      show: false,
      isRadio: true,
	  text:'',
      type: "login",
      form: initForm(),
      videoList: [],
	  showBack: true
    };
  },
  components: { Notice },
  computed: {
    production() {
      return process.env.NODE_ENV === "production";
    },
  },
  methods: {
	async getHisVideo(){
		const [err, res] = await userApi.hisVideo();
		if (err) return;
		this.videoList = res.data
		// window.location.replace(cusUrl);
	},
	open(url){
		window.location.replace(url);
	}
  },
  created() {
    this.getHisVideo();
  },
};
</script>
<style scoped lang="less">
@height: 104px;
.chatHeight{
	// height: calc(100vh - @height);
	// height: 100vh;
}
.video{
	display: flex;
	overflow-x: hidden;
	.list{
		padding: 20px 20px;
		margin-top: 90px;
		.item{
			width: 49%;
			margin: 10px .5%;
			float: left;
			text-align: center;
			img{
				width: calc(100% - 4px);
				height: 240px;
				border: 2px solid #e0e0e0;
				border-radius: 12px;
			}
		}
	}
}
@media (min-width: 500px) {
  .video{
	height: 60rem !important;
  	.list{
  		margin-top: 0px !important;
		padding: 40px 40px !important;
		overflow-y: auto;
		height: calc(100% - 90px);
  		.item{
			// height: calc(60rem - );
  			width: 49%;
  			margin: 40px .5% !important;
  			img{
  				width: calc(100% - 8px) !important;
  				height: 680px !important;
  				border: 4px solid #e0e0e0;
  				border-radius: 24px !important;
  			}
  		}
  	}
  }
}
</style>
