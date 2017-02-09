var path = require('path');
var webpack = require('webpack');

module.exports = {
  // devtool: 'source-map',
  entry: {
    client: [
      './src/client/index.js'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  module: {
    // noParse: /\.ne$/,
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: [path.join(__dirname, 'src')]
    }, {
      test: /\.css$/,
      loaders: ["style-loader", "css-loader", "sass-loader"]
    }, {
      test: /\.ne$/,
      loaders: ["raw-loader"]
    }]
  },
  node: {
    'fs': 'empty',
  }
};
