const { exec } = require("child_process");
//const semver = require("semver");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

// 启用插件
dayjs.extend(utc);
dayjs.extend(timezone);

// 设置时区为北京时间
dayjs.tz.setDefault("Asia/Shanghai");

// 获取当前时间并格式化
const beijingTime = dayjs().format("YYYY/MM/DD HH:mm:ss");
// 更新 VUE_APP_VERSION 环境变量
const envFilePath = path.resolve(__dirname, ".env");
// 读取已存在的环境变量
let envContent = "";
try {
  envContent = fs.readFileSync(envFilePath, "utf8");

  const oldVersion = envContent
    .match(/^VUE_APP_VERSION\s*=\s*.*/m)[0]
    .replace(/^VUE_APP_VERSION\s*=\s*/, "");
  // const newVersion = semver.inc(oldVersion, "patch"); // 可以更改 'patch' 为 'minor' 或 'major'
  const newVersion = +oldVersion + 1;
  // 更新或追加 VUE_APP_VERSION 变量
  envContent = envContent.replace(
    /^VUE_APP_VERSION\s*=\s*.*/m,
    `VUE_APP_VERSION=${newVersion}`
  );

  // 写入文件
  fs.writeFileSync(envFilePath, envContent);
  console.log(`Version updated from ${oldVersion} to ${newVersion}`);

  exec(`git add .env`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);

    // 提交代码
    exec(
      `git commit -m "version:${newVersion} ${beijingTime}"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        // 推送到远程仓库
        exec(`git push`, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        });
      }
    );
  });
} catch (err) {
  console.error("Error reading .env file:", err);
}
