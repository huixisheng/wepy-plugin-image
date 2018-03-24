const path = require('path');
const util = require('util');
const webpack = require('webpack');
const webpackConfig = require('@x-scaffold/webpack-config');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const _ = require('node-plus-string');

const pkg = require('./package.json');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const cleanPlugin = new CleanWebpackPlugin(['dist'], {
  verbose: true,
});

module.exports = {
  target: 'node',
  entry: {
    index: './src/index.js',
  },
  output: {
    hashDigestLength: 8,
    path: path.resolve(__dirname, './dist/'),
    filename: 'index.js',
    // chunkFilename: `[name].js`,
  },
  module: {
    rules: webpackConfig.styleLoaders({
      sourceMap: false,
      extract: process.env.NODE_ENV === 'production' }).concat([
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.resolve('src')],
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: webpackConfig.loaders,
          // other vue-loader options go here
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg|jpeg)$/,
        loader: 'file-loader',
        options: {
          name: '[name][hash].[ext]',
        },
      },
    ]),
  },
  resolve: {
    modules: [
      path.resolve('src'),
      path.resolve('node_modules'),
    ],
    extensions: ['.js', '.vue', '.json'],
    // root: path.resolve('src'),
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      src: resolve('src'),
    },
  },
  performance: {
    hints: false,
  },
  plugins: [
    cleanPlugin,
    new StyleLintPlugin({
      failOnError: false,
      files: ['**/*.s?(a|c)ss', 'src/**/**/*.vue', 'src/***/*.css'],
      // files: '../static/.css'
    }),
  ],
};

if (process.env.NODE_ENV === 'development') {
  module.exports = Object.assign(module.exports, {
    // devtool: '#eval-source-map',
    devtool: '#source-map',
  });
}

if (process.env.NODE_ENV === 'production') {
  // module.exports.devtool = '#source-map';
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ]);
}