<template>
  <div class="opens-list" >
    <div class="content font9">
      <div class="item font9" v-for="(item, index) in data">
        <div class="nav nav1 font9">{{ item.qq }}</div>
        <div class="nav font9">上</div>
        <div class="nav nav2 font9">{{ item.currUp }}</div>
        <div class="nav font9">下</div>
        <div class="nav nav3 font9">{{ item.currDown }}</div>
        <div class="nav font9">回</div>
        <div class="nav nav4 font9">{{ item.water }}</div>
        <div class="nav font9">{{ item.nickname }}</div>
        <div class="nav font9">:</div>
        <div class="nav font9">{{ item.balance }}</div>
      </div>
    </div>
  </div>

<!--  <table class="opens-table"  @copy.prevent="copyFixed">-->
<!--    <tbody>-->
<!--    <tr v-for="(item, index) in data" :key="index">-->
<!--      <td class="col-qq">{{ item.qq }}</td>-->
<!--  <td class="col-up">上{{ item.currUp }}</td>-->
<!--     <td class="col-down">下{{ item.currDown }}</td>-->
<!--      <td class="col-water">回{{ item.water }}</td>-->
<!--      <td class="col-name">{{ item.nickname }}:{{ item.balance }}</td>-->


<!--    </tr>-->
<!--    </tbody>-->
<!--  </table>-->
</template>

<script>
export default {
  name: "imgMsg",
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
      let str = this.doc.data;
      return this.doc.data;
    },
  },
  methods: {
    // onCopy(e) {
    //   const lines = this.data.map(item => [
    //     item.qq, '上', item.currUp, '下', item.currDown, '回', item.water, item.nickname, ':', item.balance
    //   ].join('\t'));
    //
    //   const tsv = lines.join('\n');
    //
    //   // 可选：提供一个简单的 HTML 表格，让粘到富文本（如邮件/钉钉）也保留表格结构
    //   const html = `
    //   <table>
    //     ${this.data.map(item => `
    //       <tr>
    //         <td>${item.qq}</td><td>上${item.currUp}</td>
    //         <td>下${item.currDown}</td>
    //         <td>回${item.water}</td>
    //         <td>${item.nickname}</td><td>:</td><td>${item.balance}</td>
    //       </tr>`).join('')}
    //   </table>
    // `;
    //
    //   e.clipboardData.setData('text/plain', tsv);   // 粘到记事本/Excel 规整
    //   e.clipboardData.setData('text/html', html);   // 粘到富文本仍是表格
    // }


    // 计算“显示宽度”：ASCII 记 1，其他（中文等 CJK）记 2
    dispLen(str) {
      let n = 0;
      for (const ch of String(str)) {
        const cp = ch.codePointAt(0);
        n += (cp <= 0x007f) ? 1 : 2;
      }
      return n;
    },
    padRight(str, width) {
      const cur = this.dispLen(str);
      return String(str) + ' '.repeat(Math.max(0, width - cur));
    },
    copyFixed() {
      // 1) 组装行/列
      const rows = this.data.map(item => ([
        String(item.qq),
        `上${item.currUp}`,
        `下${item.currDown}`,
        `回${item.water}`,
        `${item.nickname}:${item.balance}`
      ]));

      // 2) 动态计算每列最大“显示宽度”
      const colW = Array(5).fill(0);
      rows.forEach(cols => cols.forEach((c, i) => {
        colW[i] = Math.max(colW[i], this.dispLen(c));
      }));

      // 3) 纯文本：用空格补齐到等宽（适合记事本/IDE）
      const fixedText = rows
          .map(cols => cols.map((c, i) => this.padRight(c, colW[i])).join(' '))
          .join('\n');

      // 4) 富文本：HTML 表格（适合邮件/钉钉/Word/Excel）
      const html = `
      <table>
        ${rows.map(cols => `<tr>${cols.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
      </table>`;

      // 5) 写入剪贴板（优先 text/plain 为等宽文本）
      if (window.ClipboardItem) {
        const data = {
          'text/plain': new Blob([fixedText], { type: 'text/plain' }),
          'text/html':  new Blob([html],      { type: 'text/html'  }),
        };
        navigator.clipboard.write([new ClipboardItem(data)]).catch(console.error);
      } else {
        // 兼容降级
        navigator.clipboard.writeText(fixedText).catch(console.error);
      }
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
  width: 80vw;
  .num {
    padding: 10px 18px;
    line-height: 50px;
    font-weight: bold;
    // background-color: #bf2834;
    border-bottom: 2px solid #e0e0e0;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  .content {
    display: flex;
    padding: 20px;
    flex-wrap: wrap;
    .item {
      margin: 0 4px;
      width: 100%;
      color: #bf2834;
      // width: calc(33.33% - 8px);
      // flex: 1 1 33.333%;
      // box-sizing: border-box;
      .nav {
        text-align: left;
        float: left;
      }
      .nav1 {
        width: 60px;
      }
      .nav2 {
        width: 80px;
      }
      .nav3 {
        width: 80px;
      }
      .nav4 {
        width: 50px;
      }
    }
  }
}

.doc-line {
  //虚线
  border-top: 1px dashed #bf2834;
}
@media (min-width: 500px) {
  .opens-list {
    width: 21rem;
  }
  .content {
    padding: 40px;
    .item {
      margin: 0 16px;
      color: #bf2834;
      // width: calc(33.33% - 8px);
      // flex: 1 1 33.333%;
      // box-sizing: border-box;
      .nav {
        text-align: left;
        float: left;
      }
      .nav1 {
        width: 180px !important;
      }
      .nav2 {
        width: 240px !important;
      }
      .nav3 {
        width: 240px !important;
      }
      .nav4 {
        width: 160px !important;
      }
    }
  }
}


//.opens-table { width: 80vw; border-collapse: collapse; color:#bf2834;
//  background-color: #fff;
//  border-radius: 6px; }
//
//
//.opens-table tbody{
//  font-size: 26px;
//}
//.opens-table td { padding: 0 1px; }
//
//@media (min-width: 500px) { .opens-table { width: 21rem; } .opens-table tbody{
//                                                             font-size: 70px;
//                                                           }}
</style>
