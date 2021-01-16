const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const mergeJSON = require( 'handlebars-webpack-plugin/utils/mergeJSON' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const projectData = mergeJSON( path.join( __dirname, '/src/index.json' ) );
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: [ './src/index.ts', './src/styles.scss' ],
  output: {
    path: path.join( __dirname, '/dist' ),
    filename: isDevelopment ? '[name].js' : '[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: [ 'source-map-loader' ]
      },
      {
        test: /\.s(a|c)ss$/,
        loader: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isDevelopment
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isDevelopment
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: false }
          }
        ]
      },
      {
        test: /\.hbs$/,
        use: [
          {
            loader: 'handlebars-loader',
            options: { helperDirs: path.resolve( __dirname, './src/helpers' ) }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.js', '.jsx', '.ts', '.tsx', '.scss' ]
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.hbs',
      filename: './index.html',
      templateParameters: projectData,
      minify: false
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
    })
  ]
};