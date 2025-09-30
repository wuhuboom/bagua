const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  productionSourceMap: false,
  transpileDependencies: true,
  // publicPath: "./",
  devServer: {
    client: {
      overlay: false,
    },
  },
  lintOnSave: false,
  css: {
    loaderOptions: {
      less: {
        // 属性值包裹在lessOptions内
        lessOptions: {
          javascriptEnabled: true,
          globalVars: {
            "bg-color": "#fff",
            navHeight: "46px",
          },
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      config.optimization.minimizer("terser").tap((args) => {
        args[0] = args[0] || {};
        args[0].terserOptions = args[0].terserOptions || {};
        args[0].terserOptions.compress = {
          ...(args[0].terserOptions.compress || {}),
          drop_debugger: true,
          // // 只移除这些，保留 warn/error
          // pure_funcs: [
          //   "console.log",
          //   "console.debug",
          //   "console.trace",
          //   "console.info",
          // ],
          // 全部移除
          drop_console: true,
        };
        args[0].extractComments = false;
        return args;
      });
    }
  },
});
