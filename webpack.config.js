"use strict"

const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const debug = process.env.NODE_ENV !== "production"

module.exports = {
  entry: {
    main: ['babel-polyfill', './src/index.js'],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: debug ? 'bundle.js' : '[name].[chunkhash].js',
  },
  plugins: debug
    ? [
        new HtmlWebpackPlugin({
          title: 'smigo: A Go application',
          template: 'index.html',
          filename: path.resolve(__dirname, 'index.html'),
          inject: 'body'
        }),
      ]
    : [
        new CleanWebpackPlugin(['dist'], {
          root: __dirname,
          verbose: true,
          dry: false,
          exclude: ['shared.js']
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          minChunks: function (module) {
              // this assumes your vendor imports exist in the node_modules directory
              return module.context && module.context.indexOf('node_modules') !== -1;
          }
        }),
        // CommonChunksPlugin will now extract all the common modules from vendor and main bundles
        new webpack.optimize.CommonsChunkPlugin({
          // But since there are no more common modules between them
          // we end up with just the runtime code included in the manifest file
          name: 'manifest'
        }),
        new HtmlWebpackPlugin({
          title: 'smigo: A Go application',
          template: 'index_dist.html',
          filename: path.resolve(__dirname, 'dist/index.html'),
          inject: 'body'
        }),
      ],
  module: {
    rules: [
      {
        exclude: path.resolve(__dirname, "node_modules"),
        include: path.resolve(__dirname, "src"),
        loader: "babel-loader",
        options: {
          "plugins": [
            ["import", { "libraryName": "antd", "style": "css" }] // `style: true` for less
          ],
          presets: ['react', 'es2015', 'stage-1']
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  },
  performance: {
    hints: "warning", // enum
    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000, // int (in bytes)
    assetFilter: function(assetFilename) {
      // Function predicate that provides asset filenames
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};