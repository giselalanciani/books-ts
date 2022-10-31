const miniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");

console.log(
  "the resolve is: ",
  path.resolve(__dirname, "dist", "assets", "scripts")
);

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
    clientsBundle: "./src/controllers/clients/list-clients-controller.ts",
    createClientsBundle:
      "./src/controllers/clients/create-clients-controller.ts",
    editClientsBundle: "./src/controllers/clients/edit-clients-controller.ts",
    usersBundle: "./src/controllers/users/list-user-controller.ts",
    createUsersBundle: "./src/controllers/users/create-user-controller.ts",
    editUsersBundle: "./src/controllers/users/edit-user-controller.ts",
    logInBundle: "./src/controllers/login/log-in-controller.ts",
  },
  devtool: "inline-source-map",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist", "assets", "scripts"),
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devtool: "inline-source-map",
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 8080,
    hot: true,
  },
  module: {
    rules: [
      {
        mimetype: "image/svg+xml",
        scheme: "data",
        type: "asset/resource",
        generator: {
          filename: "icons/[hash].svg",
        },
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            // Extracts CSS for each JS file that includes CSS
            loader: miniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: () => [require("autoprefixer")],
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanPlugin.CleanWebpackPlugin(),
    new miniCssExtractPlugin({ filename: "main.css" }),
  ],
};
