module.exports = (env) => ({
  devtool: env.production ? false : 'eval-source-map',
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  corejs: '3.8',
                  useBuiltIns: 'usage',
                },
              ],
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.xml$/i,
        use: 'xml-loader',
      },
    ],
  },
  output: {
    filename: 'tracker.js',
    path: __dirname,
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  target: 'web',
});
