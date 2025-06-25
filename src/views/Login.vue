<!-- eslint-disable prettier/prettier -->
<template>
  <div class="page chatHeight">
	  <div class="opr">
		  <div class="font16">玩家输入链接</div>
		  <input
		    type="text"
		    class="input font13"
		    ref="inputRef"
		    v-model="text"
		  />
		  <el-button class="btn font13" @click="login">确认</el-button>
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
      codeData: {},
    };
  },
  components: { Notice },
  computed: {
    production() {
      return process.env.NODE_ENV === "production";
    },
  },
  methods: {
    async verifyCodeReq() {
      const [err, res] = await userApi.verifyCodeReq();
      if (err) {
        return;
      }
      this.form.verifyKey = res.data.verifyKey;
      this.codeData = res.data;
    },
    login() {
      if(this.text == '') {
        return;
      }
	  
	  auth.setToken(this.text, "token");
	  let url = window.location.origin + "?token="+this.text;
	  window.location.replace(url);
    },
  },
  created() {
    this.verifyCodeReq();
	if(auth.getToken("token")){
		this.text = auth.getToken("token");
	}
  },
};
</script>
<style scoped lang="less">
@height: 104px;
.chatHeight{
	height: calc(100vh - @height);
}
.page {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	.opr{
		background-color: #e0e0e0;
		border-radius: 20px;
		display: inline-table;
		width: 80%;
		height: 300px;
		padding:40px;
		.input {
		  width: 100%;
		  border: none;
		  border-radius: 10px;
		  padding: 20px;
		  padding-left: 30px;
		  background: #fff;
		  margin: 20px 0;
		}
		.btn{
			width: 100%;
			height: 80px;
			color: #fff;
			border-radius: 20px;
			background-color: #e32e3d;
		}
	}
}
@media (min-width: 750px) {
  .chatHeight{
	height: 90vh;
  }
	.opr{
		border-radius: 26px !important;
		height: 600px !important;
		padding:80px !important;
		.input {
		  border-radius: 20px !important;
		  padding: 40px !important;
		  padding-left: 60px !important;
		  margin: 40px 0 !important;
		}
		.btn{
			height: 240px !important;
			border-radius: 40px !important;
		}
	}
}
</style>
