import store from "@/store";

// // 表情包回显
// export function wxEmojis(str) {
//   let iconArr = store.getters["wxEmojisData/wxEmojisDataGet"];
//   const icoLen = 7; // 每行表情个数（请根据实际情况修改）
//   const icoWidth = 50; // 单个表情的宽度（请根据图片实际大小修改）
//   const icoHeight = 50; // 单个表情的高度（请根据图片实际大小修改）

//   iconArr.forEach((item, index) => {
//     if (str.includes(item)) {
//       let colIndex = index % icoLen; // 计算列索引
//       let rowIndex = Math.floor(index / icoLen); // 计算行索引

//       let bgLeft = -(colIndex * icoWidth) + "px"; // 计算 X 轴位置
//       let bgTop = -(rowIndex * icoHeight) + "px"; // 计算 Y 轴位置
//       let bhPosition = `${bgLeft} ${bgTop}`; // 拼接 CSS 背景位置

//       // 替换文本为表情 HTML
//       str = str.replaceAll(
//         item,
//         `<i class="wxEmojis" contenteditable="false" style="width:${icoWidth}px; height:${icoHeight}px;background-position:${bhPosition};  display:inline-block;" data-value="${item}"></i>`
//       );
//     }
//   });

//   return str;
// }

// //表情包回显
// export function wxEmojis(str) {
//   let iconArr = store.getters["wxEmojisData/wxEmojisDataGet"]; //存放表情包的数组
//   iconArr.forEach((item, index) => {
//     if (str.indexOf(item) !== -1) {
//       let bgLeft = "", //横坐标
//         bgTop = "", //纵坐标
//         bhPosition = "0 0",
//         icoLen = 7, //表情包-行的个数
//         icoHeight = 36; //表情包的高度
//       if (index < 7) {
//         //第一列的表情包
//         bgLeft = -(24 * index + 16.8 * index) + "px";
//         console.log("bgLeft", bgLeft);
//         bgTop = 0;
//         bhPosition = bgLeft + " " + bgTop;
//       } else if (index >= 7) {
//         let icoColumn = parseInt(index / 7); //表情包第几列
//         bgLeft =
//           -(
//             24 * (index - icoColumn * icoLen) +
//             16.8 * (index - icoColumn * icoLen)
//           ).toFixed(2) + "px";
//         bgTop = -(icoColumn * icoHeight) + "px";
//         bhPosition = bgLeft + " " + bgTop;
//       }
//       str = str.replaceAll(
//         item,
//         '<i class="wxEmojis" contenteditable="false" style="background-position:' +
//           bhPosition +
//           '" data-value=' +
//           item +
//           "></i>"
//       );
//     }
//   });
//   return str;
// }

//表情包回显
export function wxEmojis(str) {
  let iconArr = store.getters["wxEmojisData/wxEmojisDataGet"]; //存放表情包的数组
  iconArr.forEach((item, index) => {
    if (str.indexOf(item) !== -1) {
      let bgLeft = "", //横坐标
        bgTop = "", //纵坐标
        bhPosition = "0 0",
        icoLen = 7, //表情包-行的个数
        icoHeight = 38; //表情包的高度
      if (index < 7) {
        //第一列的表情包
        bgLeft = -(31 * index + 8 * index) + "px";
        bgTop = 0;
        bhPosition = bgLeft + " " + bgTop;
      } else if (index >= 7) {
        let icoColumn = parseInt(index / 7); //表情包第几列
        bgLeft =
          -(
            31 * (index - icoColumn * icoLen) +
            8 * (index - icoColumn * icoLen)
          ).toFixed(2) + "px";
        bgTop = -(icoColumn * icoHeight) + "px";
        bhPosition = bgLeft + " " + bgTop;
      }
      str = str.replaceAll(
        item,
        '<i class="wxEmojis" contenteditable="false" style="background-position:' +
          bhPosition +
          '" data-value=' +
          item +
          "></i>"
      );
    }
  });
  return str;
}
