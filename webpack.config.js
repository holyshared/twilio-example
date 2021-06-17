const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

const development = process.env.NODE_ENV !== 'production' ? { devtool: "source-map" } : {};

module.exports = [
  {
    mode: process.env.NODE_ENV,
    entry: {
      "app": path.resolve(__dirname, 'src/client/app.tsx'),
    },
    output: {
      path: path.resolve(__dirname, 'public/assets/js'),
      publicPath: `/assets/`
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              caller: { target: 'web' },
            },
          },
        }
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.TWILIO_IDENTITY': JSON.stringify(process.env.TWILIO_IDENTITY),
        'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
        'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
        'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
        'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
        'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
        'process.env.FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID),
      }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['public/assets/js'],
        cleanStaleWebpackAssets: false
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    stats: 'errors-only',
    optimization: {
      minimize: false,
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "bundle",
            chunks: "initial"
          }
        }
      }
    },
    ...development
  }
];