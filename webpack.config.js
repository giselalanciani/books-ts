const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    homeBundle: "./src/controllers/home-controller.ts",
    authorsBundle: "./src/controllers/authors/list-authors-controller.ts",
    createAuthorsBundle:
      "./src/controllers/authors/create-authors-controller.ts",
    editAuthorsBundle: "./src/controllers/authors/edit-authors-controller.ts",
    countriesBundle: "./src/controllers/countries/list-country-controller.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist", "assets", "scripts"),
    publicPath: "assets/scripts/",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new CleanPlugin.CleanWebpackPlugin()],
};
