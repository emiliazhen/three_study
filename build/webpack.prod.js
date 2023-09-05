const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')

const prodConfig = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name]/[name]-bundle.[contenthash:8].js',
    chunkFilename: 'js/[name]/[name]-bundle.[contenthash:8].js', // splitChunks提取公共js时的命名规则
    publicPath: '/three_study/',
  },
  module: {
    rules: [
      {
        // test设置需要匹配的文件类型，支持正则
        test: /\.css$/,
        // use表示该文件类型需要调用的loader
        // use: ['style-loader', 'css-loader'],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          // css兼容性处理; 据路径找配置文件
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, '../postcss.config.js'),
              },
            },
          },
        ],
      },
      // {
      //   test: /\.less$/,
      //   use: [...commonCssLoader, 'less-loader'],
      // },
      {
        test: /\.scss$/,
        // use: ['style-loader', 'css-loader', 'sass-loader'],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: false,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, '../postcss.config.js'),
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 单独提取css文件
      filename: 'css/[name]/[name]-bundle.[contenthash:8].css',
      chunkFilename: 'css/[name]/[name]-bundle.[contenthash:8].css', // splitChunks提取公共css时的命名规则
    }),
    // new OptimizeCSSPlugin({
    //   cssProcessorOptions: { safe: true }, // 压缩打包的css
    // }),
    new CssMinimizerPlugin(),
    new WebpackManifestPlugin(), // 生成manifest.json
    new CleanWebpackPlugin(), // 打包前先删除之前的dist目录
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        // 去掉console
        terserOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log'],
          },
        },
      }),
    ],
  },
}
module.exports = merge(baseConfig, prodConfig)
