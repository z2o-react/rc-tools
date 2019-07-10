'use strict'

const path = require('path')

function getTemplateConfigFilePath(fileName) {
  return path.join(__dirname, '..', 'config', fileName)
}

function getCompilerOptions() {
  const defaultConfig = require(getTemplateConfigFilePath('tsconfig.json'))
  return {
    ...defaultConfig.compilerOptions,
  }
}

module.exports = getCompilerOptions
