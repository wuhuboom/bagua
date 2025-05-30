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
});
