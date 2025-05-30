/* eslint-disable */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const fs = require("fs");
const path = require("path");

// 读取命令行参数
const inputPath = process.argv[2];

if (!inputPath) {
  console.error("Please provide a file or folder path.");
  process.exit(1);
}

// 处理单个文件
function processFile(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    // 匹配以 rem 为单位的数值的正则表达式
    const remRegex = /(\d*\.?\d+)px/g;

    // 替换 rem 单位为 px 单位
    const convertedData = data.replace(remRegex, (match, value) => {
      const pxValue = Math.round(parseFloat(value) * 2); // 将 rem 转换为 px 并四舍五入到整数
      return pxValue + "px";
    });

    // 将转换后的内容写回文件
    fs.writeFile(filePath, convertedData, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("Conversion complete. File", filePath, "has been updated.");
    });
  });
}

// 处理文件夹
function processFolder(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading folder:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error getting file stats:", err);
          return;
        }
        if (stats.isFile()) {
          processFile(filePath);
        } else if (stats.isDirectory()) {
          processFolder(filePath);
        }
      });
    });
  });
}

// 判断输入路径是文件还是文件夹
fs.stat(inputPath, (err, stats) => {
  if (err) {
    console.error("Error getting input path stats:", err);
    return;
  }
  if (stats.isFile()) {
    processFile(inputPath);
  } else if (stats.isDirectory()) {
    processFolder(inputPath);
  }
});
