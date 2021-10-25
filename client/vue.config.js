const path = require("path")

module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  devServer: {
    proxy: 'http://localhost:4000'
  },
  outputDir: path.resolve(__dirname, "../server/dist"),
};
