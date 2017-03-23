const webpack = require('webpack')
const path = require('path');

module.exports = {
  entry: {
    main: ['babel-polyfill', './src/index.js'],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].[chunkhash].js',
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
          // this assumes your vendor imports exist in the node_modules directory
          return module.context && module.context.indexOf('node_modules') !== -1;
      }
    })
  ],
  module: {
    rules: [
      {
        exclude: path.resolve(__dirname, "node_modules"),
        include: path.resolve(__dirname, "src"),
        loader: "babel-loader",
        options: {
          presets: ['react', 'es2015', 'stage-1']
        }
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