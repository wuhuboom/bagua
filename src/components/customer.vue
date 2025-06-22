<template>
  <van-popup v-model="show" style="background-color: transparent">
    <div class="publish-pop center-center">
      <div class="publish-main">
		<div class="top">
			选择客服类型
		</div>
        <div class="info-box">
          <div class="box-1" v-for="(item, index) in customer" :key="index" @click="jump(item)">
            <div class="t-1">{{ item.name }}</div>
            <div class="t-2"></div>
          </div>
        </div>
       <!-- <div class="btn-box">
          <div class="btn" @click="close">取消</div>
          <div class="btn on" @click="sure">确认</div>
        </div> -->
      </div>
    </div>
  </van-popup>
</template>
<script>
import userApi from "@/api/user";
export default {
  name: "customerDialog",
  data() {
    return {
      show: false,
      txt: ""
    };
  },
  props: {
    autoClose: {
      type: Boolean,
      default: true,
    },
  },
  
  computed: {
    customer() {
      return this.$store.state.customer;
    },
  },
  methods: {
    close() {
      this.show = false;
    },
    sure() {
      this.show = false;
      this.$emit("sure");
    },
	async getCustomer() {
	  const [err, res] = await userApi.servReqV2();
	  if (err) return;
	  this.customer = res.data;
	},
    open() {
      this.show = true;
    },
	jump(v){
		const host = window.btoa(window.location.origin);
		const link = v.url;
		location.href =
		  link.indexOf("?") !== -1
		    ? `${link}&toUrl=${host}`
		    : `${link}?toUrl=${host}`;
	}
  },
};
</script>
<style lang="scss" scoped>
.publish-pop {
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
  }
  .publish-main {
    position: relative;
    width: 468px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #fff;
    .top {
      background: #fff;
      font-size: 34px;
      font-weight: 500;
      text-align: center;
      padding: 16px;
      color: #000;
	  border-bottom: 2px solid #e0e0e0;
    }
    .info-box {
      padding: 0 26px;
      // height: 192px;
      .box-1 {
        margin: 24px 20px;
		padding: 8px 0;
		border-radius: 8px;
		background-color: #be2834;
		color: #fff;
		line-height: 40px;
        text-align: center;
        .t-1 {
          font-size: 32px;
          font-weight: 500;
        }
        .t-2 {
          color: #777777;
          margin-top: 8px;
        }
      }
      .box-2 {
        padding: 26px 0;
        .t-box {
          display: flex;
          margin-top: 12px;
          font-weight: 500;
          &:first-child {
            margin-top: 0;
          }
          .l-t {
            width: 300px;
            text-align: right;
          }
          .r-t {
            .on {
              color: #be2834;
              right: 4px;
            }
          }
        }
      }
    }
    .btn-box {
      display: flex;
      .btn {
        flex: 1;
        height: 88px;
        line-height: 88px;
        text-align: center;
        border: 1px solid #be2834;
        &.on {
          background: #be2834;
          color: #fff;
        }
      }
    }
  }
}
</style>
