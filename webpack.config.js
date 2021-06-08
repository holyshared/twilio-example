const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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