const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

  entry: {
    app: './src/app.js'
  },

  devtool: 'source-map',

  output: {
    path: './build',
    filename: '[name].js'
  },

  resolve: {
    modulesDirectories: [
      'node_modules'
    ]
  },

  module: {
    loaders: [{
      test: /\.js$/,
      include: [
        path.resolve(__dirname, './src')
      ],
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'stage-0']
      }
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
    }]
  },

  plugins: [
    new ExtractTextPlugin('app.css')
  ],

  watch: true,
  watchOptions: {
    poll: true,
    aggregateTimeout: 100
  }

};
