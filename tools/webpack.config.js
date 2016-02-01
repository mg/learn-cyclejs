var path = require('path')

module.exports = {
  entry: './client/index.js',
  output: {
    path: './server/static',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { test: /\.(js|jsx|es6)$/, loader: 'babel?stage=0&optional[]=runtime', exclude: /node_modules/ },
      { test: /\.(css)$/, loader: 'style!css!autoprefixer?browsers=last 2 version' },
      { test: /\.(less)$/, loader: 'style!css!autoprefixer?browsers=last 2 version!less' },
      { test: /\.(png|jpg)$/, loader: 'url?size=8912' },
      {
        test: /\.(sass|scss)$/,
        loader: 'style!css!sass?outputStyle=expanded&includePaths[]=' + (path.resolve(__dirname, '../node_modules'))
      },
      { test: /\.(png|jpg)$/, loader: 'url?size=8912' },
    ],
  },
  node: {
    __filename: true
  }
}
