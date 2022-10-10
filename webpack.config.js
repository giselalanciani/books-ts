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
    createCountryBundle:
      "./src/controllers/countries/create-country-controller.ts",
    editCountryBundle: "./src/controllers/countries/edit-country-controller.ts",
    statesBundle: "./src/controllers/states/list-state-controller.ts",
    createStatesBundle: "./src/controllers/states/create-state-controller.ts",
    editStatesBundle: "./src/controllers/states/edit-state-controller.ts",
    editorialsBundle:
      "./src/controllers/editorials/list-editorial-controller.ts",
    createEditorialsBundle:
      "./src/controllers/editorials/create-editorial-controller.ts",
    editEditorialsBundle:
      "./src/controllers/editorials/edit-editorial-controller.ts",
    branchesBundle: "./src/controllers/branches/list-branches-controller.ts",
    createBranchesBundle:
      "./src/controllers/branches/create-branches-controller.ts",
    editBranchesBundle:
      "./src/controllers/branches/edit-branches-controller.ts",
    booksBundle: "./src/controllers/books/list-books-controller.ts",
    createBookBundle: "./src/controllers/books/create-books-controller.ts",
    editBookBundle: "./src/controllers/books/edit-books-controller.ts",
    categoriesBundle:
      "./src/controllers/categories/list-categories-controller.ts",
    createCategoriesBundle:
      "./src/controllers/categories/create-categories-controller.ts",
    editCategoriesBundle:
      "./src/controllers/categories/edit-categories-controller.ts",
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
