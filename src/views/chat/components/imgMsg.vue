<template>
  <div>
    <van-image
      width="120"
      fit="cover"
      :showIndex="false"
      @click="preview"
      :src="httpSrc"
    />
    <!-- 弹出大图 -->
    <van-popup
      v-model="show"
      position="center"
      :style="{ background: 'rgba(0, 0, 0, 0)' }"
      :close-on-click-overlay="true"
    >
      <div class="img-container">
        <img :src="httpSrc" class="popup-img" />
        <img
          class="close-btn"
          src="@/assets/img/off.png"
          @click="show = false"
        />
        <!-- <div class="close-btn" @click="show = false"></div> -->
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapActions } from "vuex";
// import { ImagePreview } from "vant";
export default {
  name: "imgMsg",
  data() {
    return {
      show: false,
    };
  },
  props: {
    doc: {
      // type: Object,
      type: [Object, String],
      default: () => {},
    },
    userPic: {
      type: String,
      default: "",
    },
  },
  computed: {
    httpSrc() {
      // console.log("this.doc123", this.doc);
      if (typeof this.doc === "string") {
        return this.doc.includes("http")
          ? this.doc
          : `${this.$baseURL}/${this.doc}`;
      } else if (typeof this.doc === "object") {
        return this.doc.data.includes("http")
          ? this.doc.data
          : `${this.$baseURL}/${this.doc.data}`;
      }

      return "";
    },
  },
  methods: {
    ...mapActions("chat", [
      "initWebSocket",
      "closeWebSocket",
      "sendMessage",
      "fetchHistory",
    ]),
    preview() {
      console.log("preview", this.httpSrc);
      // ImagePreview([this.httpSrc]);
      this.show = true;
    },
  },
};
</script>
<style scoped lang="scss">
.red-img {
  width: 468px;
  height: 172px;

  img {
    object-fit: contain;
  }
}

.popupOpen {
  padding-top: 146px;
  width: 510px;
  height: 794px;
  background: url("@/assets/img/openRed.png") no-repeat center;
  background-size: 100% 100%;
  color: #feedaf;

  .d-desc {
    font-size: 36px;
  }
}

.user-red {
  width: 32px;
  height: 32px;
}

.popupFinish {
  padding-top: 408px;
  width: 510px;
  height: 798px;
  background: url("@/assets/img/finishRed.png") no-repeat center;
  background-size: 100% 100%;

  .names {
    color: #191919;
  }

  .d-desc {
    color: #999999;
    font-size: 24px;
  }

  .d-meng {
    font-size: 84px;
    color: #cdac74;
    align-items: baseline;

    span {
      font-size: 24px;
    }
  }

  .view {
    color: #b78756;
    font-size: 24px;
  }
}

.table-lists {
  .hearder {
    background: #f0f0f0;
    color: #333 !important;
    margin: 0 !important;
    padding: 0 30px;
  }

  .row {
    display: grid;
    grid-template-columns: 50% 50%;
    color: #777777;
    border-bottom: 1px solid #eaeaea;
    align-items: center;
  }

  .col {
    padding: 24px 0;
    text-align: center;
  }
}

.redRecord {
  //width: 994px;
  //height: 648px;

  background: #fff;

  .red-active {
    color: #feedaf;
  }

  .red-close {
    position: absolute;
    top: 0px;
    right: 0;
    width: 108px;
  }

  .one-doc {
    height: 50px;
    border-bottom: 2px solid rgba(254, 237, 175, 0.3);
  }
}

.reg-img-cont {
  width: 468px;
  height: 172px;
  background-size: 100% 100%;
  color: #fff;

  .describes {
    padding-top: 42px;
    padding-left: 122px;
    margin-bottom: 40px;
  }

  .status {
    margin-left: 28px;
  }
}

.img-container {
  position: relative;
  width: 636px;
}

.popup-img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.close-btn {
  display: block;
  width: 64px;
  height: 64px;
  margin: 42px auto 0;
}
</style>
