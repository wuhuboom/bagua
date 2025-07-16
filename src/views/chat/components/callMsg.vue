<!-- eslint-disable no-empty -->
<!-- eslint-disable no-empty -->
<template>
  <div class="repaly-txt p-x-16 m-t-4 font13">
    <p v-html="highlightedText(doc.data?.msg)"></p>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "repalyMsg",
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
    replay() {
      return this.doc.data?.replay || {};
    },
    replayData() {
      try {
        return JSON.parse(this.replay.data);
      } catch (e) {
        return this.replay.data;
      }
      //return this.replay.data || {};
    },
    httpSrc() {
      return this.doc.data.includes("http")
        ? this.doc.data
        : `${this.$baseURL}/${this.doc.data}`;
    },
  },
  methods: {
    ...mapActions("chat", [
      "initWebSocket",
      "closeWebSocket",
      "sendMessage",
      "fetchHistory",
    ]),
    replayFn(v) {
      const obj = JSON.parse(v);
      return obj.msg;
    },
    goview(v) {
      document.querySelector(`[data-msg-id="${v}"]`)?.scrollIntoView();
    },
    highlightedText(v) {
      return v.replace(
        /@(\S+)/g,
        '<span style="color:#488fca;margin:0 4px;">@$1</span>'
      );
    },
  },
};
</script>
<style scoped lang="scss">
.repaly-txt {
  background: #ffffff;
  border-radius: 10px 10px 10px 10px;
  border: 2px solid #f0f0f0;
}
.replays {
  background-color: #f5f5f5;
}
</style>
