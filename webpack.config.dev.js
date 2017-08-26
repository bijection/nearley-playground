var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    client: [
      './src/client/index.js'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/dist/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    noParse: /\.ne$/,
    rules: [{
      test: /\.js$/,
      use: ['babel-loader'],
      include: [path.join(__dirname, 'src')]
    }, {
      test: /\.css$/,
      use: ["style-loader", "css-loader", "sass-loader"]
    }, {
      test: /\.ne$/,
      use: ["raw-loader"]
    }]
  },
  node: {
    fs: "empty"
  }
};