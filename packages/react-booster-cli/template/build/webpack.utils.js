const glob = require("glob");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require("fs");
const isProd = process.env.NODE_ENV === "production"; // https://webpack.docschina.org/api/cli/#node-env
const { platform, pageMode } = require("../app.config.json");
const getPageName = (filePath, isMPA) => {
  const reg = isMPA ? /src\/pages\/([^/]*)/ : /src\/([^.]+)\./;
  const match = filePath.match(reg);

  return match ? match[1] : null;
};

/**
 * 获取页面打包的入口及htmlPlugin,支持多页
 */
const getPAGES = () => {
  const isMPA = pageMode === 'MPA';
  const entryFiles = glob.sync(
    path.resolve(__dirname, `../src/${isMPA ? `pages/*/` : ""}index.{ts,tsx}`)
  );
  if(entryFiles.length === 0 ){
    throw new Error('找不到任何入口文件')
  }
  const entry = {};
  const htmlWebpackPlugins = [];
  entryFiles.forEach((filePath) => {
    const pageName = getPageName(filePath, isMPA);
    if (!pageName) {
      throw new Error(`${filePath}目录下必须存在页面入口文件`);
    }
    entry[pageName] = filePath;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.resolve(
          __dirname,
          `../src/${isMPA ? `pages/${pageName}/` : ``}index.html`
        ),
        filename: `${pageName}.html`,
        inject: "body",
        chunks: [pageName],
        minify: {
          // html5:true,
          minifyJS: true,
        },
      })
    );
  });

  return {
    entry,
    htmlWebpackPlugins,
  };
};

/**
 * 获取样式文件的loaders
 * @param {*} preprocessor 采用何种预处理器
 */
const getStyleFileLoaders = (preprocessor) => {
  const styleFileLoaders = [
    isProd ? MiniCssExtractPlugin.loader : "style-loader", // css生产环境抽离
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env",
            platform === "mobile" && [
              "postcss-pxtorem",
              { rootValue: 75, propList: ["*"] },
            ],
          ].filter(Boolean),
        },
      },
    },
  ];

  preprocessor && styleFileLoaders.push(preprocessor); // 预处理器

  return styleFileLoaders;
};

module.exports = {
  getPAGES,
  getStyleFileLoaders,
  isProd,
};
