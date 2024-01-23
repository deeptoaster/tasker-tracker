const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');

module.exports = (env) => ({
  devServer: {
    static: __dirname
  },
  devtool: env.production ? false : 'eval-source-map',
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      {
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/squiffles-components')
        ],
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  corejs: '3.8',
                  useBuiltIns: 'usage'
                }
              ],
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      }
    ]
  },
  output: {
    filename: 'tracker.js',
    path: __dirname
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['.ts', '.tsx']
    })
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  target: env.production ? 'browserslist' : 'web',
  watch: false
});
