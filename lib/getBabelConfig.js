'use strict'

module.exports = function(modules) {
  const presets = [
    [
      require.resolve('@babel/preset-env'),
      {
        modules,
      },
    ],
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-typescript'),
  ]

  const plugins = [
    require.resolve('@babel/plugin-transform-runtime'),
    require.resolve('@babel/plugin-transform-object-assign'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    require.resolve('@babel/plugin-proposal-object-rest-spread'),
  ]

  return { presets, plugins }
}
