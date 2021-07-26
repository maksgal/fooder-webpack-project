const HtmlWebPackPlugin = require("html-webpack-plugin");
var path = require("path");
module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.join(__dirname, "./src/index.html"),
      filename: "./index.html",
    }),
  ],
};
