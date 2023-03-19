const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')

const devConfig = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name]/[name]-bundle.js',
    chunkFilename: 'js/[name]/[name]-bundle.js',
    publicPath: '/',
  },
  devServer: {
    historyApiFallback: true,
    //不启动压缩
    compress: false,
    // host: '0.0.0.0',
    open: ['/index'],
    hot: true,
    port: 8081,
    proxy: {
      '/api': {
        target: 'https://xxx.com', // 后端地址
        changeOrigin: true,
        secure: false,
      },
    },
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    //   'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    // },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
              importLoaders: 2,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
}
module.exports = merge(baseConfig, devConfig)
