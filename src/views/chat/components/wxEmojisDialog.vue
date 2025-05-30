<template>
  <!-- 微笑表情包选择弹窗 -->
  <div class="wxEmojisDialog">
    <div class="pointIco"></div>
    <div class="wxEmojisList">
      <div
        class="wxEmojisItem"
        v-for="(item, index) of wxEmojisDataGet"
        :key="index"
        @click="wxEmojisClick(item)"
        v-html="wxEmojis(item)"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { wxEmojis } from "@/utils/wxEmojis";
export default {
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters("wxEmojisData", ["wxEmojisDataGet"]),
  },
  methods: {
    //微信默认表情包回显
    wxEmojis(html) {
      return wxEmojis(html);
    },

    //选择表情包
    wxEmojisClick(item) {
      // console.log("item", item);
      this.$emit("wxEmojisClick", item);
    },
  },
  created() {},
};
</script>

<style lang="scss">
.wxEmojisDialog {
  position: absolute;
  // top: 0;
  top: -80px;
  left: 140px;
  // left: 0;
  z-index: 100;
  margin-top: -303px;
  background: #fff;
  border-radius: 10px;
  margin-left: -150px;
  padding: 5px 2px 5px 5px;
  box-shadow: 0px 0px 14px 0px rgba(162, 162, 162, 0.5);

  .pointIco {
    position: absolute;
    bottom: 0;
    // left: 50%;
    left: 40px;
    margin-left: -8px;
    margin-bottom: -16px;
    width: 0px;
    height: 0px;
    border-top: #fff 8px solid;
    border-left: transparent 8px solid;
    border-right: transparent 8px solid;
    border-bottom: transparent 8px solid;
  }

  .wxEmojisList {
    display: flex;
    flex-wrap: wrap;
    width: 700px;
    height: 350px;
    overflow-y: auto;
    border-radius: 10px;

    .wxEmojisItem {
      //微信默认表情
      // width: 68px;
      // height: 68px;

      // width: 70px;
      // height: 70px;

      display: flex;
      align-items: center;
      justify-content: center;
      margin: 10px;
      cursor: pointer;
      border-radius: 8px;

      // .wxEmojis {
      //   display: inline-block;
      //   width: 48px;
      //   height: 48px;
      //   // background: blueviolet;
      //   background: url("~@/assets/img/wxEmojis.png") top left no-repeat;
      //   // background-position: -3px -3px;
      //   vertical-align: bottom;
      //   margin: 0 2px;
      //   transition: 0.2s;
      // }

      .wxEmojis {
        display: inline-block;
        // width: 50px;
        // /* 表情宽度 */
        // height: 50px;

        width: 62px;
        height: 62px;
        /* 表情高度 */
        background: url("~@/assets/img/wxEmojis.png") top left no-repeat;
        // background-position: -3px -3px;
        vertical-align: bottom;
        margin: 0 1px;
        transition: 0.2s;
      }

      &:hover {
        background: #f2f2f2;

        .wxEmojis {
          transform: scale(1.1);
        }
      }
    }
  }

  .wxEmojisList::-webkit-scrollbar {
    width: 12px;
  }

  .wxEmojisList::-webkit-scrollbar-track {
    background-color: #fff;
    border-radius: 20px;
  }

  .wxEmojisList::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 40px;
  }
}
</style>
