const webpack = require('webpack');

module.exports = {
  entry: {
    'app.bundle': ['./js/app.js'],
    'service_worker': ['./sv.js']
  },
  output: {
    filename: '[name].js'
  },
  optimization:{
    minimizer:[
      new UglifyJsPlugin({
        cache:true,
        parallel:true,
        uglifyOptions:{
          compress:false,
          ecma:6,
          mangle:true
        },
        sourceMarp:true
      })    

    ]

  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
        output: {
          comments: false,
        },
        sourceMap: true
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  watch: true,
  devtool: 'eval-source-map'
};