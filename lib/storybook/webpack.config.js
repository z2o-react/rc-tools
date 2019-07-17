const babelConfig = require('../getBabelConfig')()

module.exports = ({ config, mode }) => {
  const isDev = mode !== 'PRODUCTION'

  if (!isDev) {
    config.devtool = false
  }

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          ...babelConfig,
        },
      },
    ],
  })
  config.resolve.extensions.push('.ts', '.tsx')

  config.module.rules.push({
    test: /\.(css|less)$/,
    use: [
      {
        loader: 'style-loader',
      },
      {
        loader: 'css-loader',
      },
      {
        loader: 'less-loader',
      },
    ],
  })
  config.resolve.extensions.push('.less')

  return config
}
