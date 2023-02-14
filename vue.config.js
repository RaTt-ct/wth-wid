const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  css: {
    extract: false,
  },
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
  },
});
