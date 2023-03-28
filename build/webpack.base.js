const path = require('path')
const { getEntry, getHtmlWebpackPlugin } = require('./util')

//使用node的模块
module.exports = {
  //这就是我们项目编译的入口文件
  // entry: './src/pages/index.ts',
  entry: getEntry('./src/pages/**/index.ts'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src/'),
    },
    extensions: ['.ts', 'tsx', '.js'],
  },
  //这里可以配置一些对指定文件的处理
  //这里匹配后缀为ts或者tsx的文件
  //使用exclude来排除一些文件
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env', //基础预设
              {
                useBuiltIns: 'usage', // 按需加载
                corejs: {
                  version: 3,
                },
                targets: {
                  // 兼容到什么版本到浏览器
                  chrome: '60',
                  firefox: '50',
                  ie: '9',
                  safari: '10',
                  edge: '17',
                },
              },
            ],
          ],
          plugins: ['@babel/transform-runtime', '@babel/plugin-proposal-class-properties'],
        },
      },
      // 处理html中img资源
      {
        test: /.\html$/,
        exclude: /node_modules/,
        use: {
          loader: 'html-loader',
          options: {
            esModule: false,
          },
        },
      },
      {
        test: /\.(png|gif|bmp|jpe?g)$/,
        exclude: /node_modules/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8 * 1024,
            // 图片取10位hash和文件扩展名
            name: '[name].[hash:10].[ext]',
            // 关闭es6模块化
            esModule: false,
            //  图片资源的输出路径
            outputPath: 'images',
          },
        },
      },

      // 处理其他⽂件
      // {
      //   exclude: /\.(js|css|less|html|jpg|png|gif)/,
      //   loader: 'file-loader',
      //   options: { outputPath: 'media' },
      // },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
        exclude: /node_modules/,
        type: 'asset/inline',
      },
      {
        test: /\.(hdr|mp3|glb)$/,
        exclude: /node_modules/,
        type: 'asset/resource',
      },
      {
        test: /\.(glsl)$/,
        exclude: /node_modules/,
        loader: 'raw-loader',
      },
    ],
  },
  //这里就是一些插件
  // plugins: [
  //   new CleanWebpackPlugin({
  //     cleanOnceBeforeBuildPatterns: ['./dist'],
  //   }),
  //   new HtmlWebpackPlugin({
  //     template: './src/pages/index.html',
  //   }),
  // ],
  plugins: [...getHtmlWebpackPlugin('./src/pages/**/*.html')],
  // plugins: [
  //   // css代码单独抽离
  //   new MiniCssExtractPlugin({
  //     filename: 'css/[name]/[name]-bundle.css',
  //   }),
  //   // css代码压缩
  //   new OptimizeCssAssetsWebpackPlugin(),
  //   new HtmlWebpackPlugin({
  //     filename: 'index.html',
  //     template: './src/pages/index.html',
  //     minify: {
  //       // 移除空格
  //       collapseWhitespace: true,
  //       // 移除注释
  //       removeComments: true,
  //     },
  //     chunks: ['index'],
  //   }),
  //   new HtmlWebpackPlugin({
  //     filename: 'home.html',
  //     template: './src/pages/home/index.html',
  //     minify: {
  //       collapseWhitespace: true,
  //       removeComments: true,
  //     },
  //     chunks: ['home'],
  //   }),
  //   new HtmlWebpackPlugin({
  //     filename: 'mine.html',
  //     template: './src/pages/mine/index.html',
  //     minify: {
  //       collapseWhitespace: true,
  //       removeComments: true,
  //     },
  //     chunks: ['mine'],
  //   }),
  //   // new ManifestPlugin(),
  //   new CleanWebpackPlugin({
  //     cleanOnceBeforeBuildPatterns: ['./dist'],
  //   }),
  //   // 注册全局的依赖
  //   // new webpack.ProvidePlugin({
  //   //   $: 'jquery',
  //   //   jQuery: 'jquery',
  //   // }),
  // ],
  // 优化，提取公共的包
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          test: /node_modules/,
          name: 'vendor',
          minSize: 0,
          priority: 10,
          minChunks: 2, // 两个文件引用了就生成一个common包
        },
        common: {
          chunks: 'initial',
          name: 'common',
          minSize: 0,
          minChunks: 3, // 两个文件引用了就生成一个common包
          priority: 0,
        },
      },
    },
    runtimeChunk: { name: 'manifest' }, // 运行时代码
  },
}
