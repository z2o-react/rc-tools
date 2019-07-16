const path = require('path')
const storybook = require('@storybook/react/standalone')
const genStorybook = require('../genStorybook')
const InitStoryConfig = require('../initStorybookConfig')
const resolveCwd = require('../resolveCwd')

const projectPath = resolveCwd('./')
const pkg = require(resolveCwd('package.json'))

module.exports = function(gulp) {
  gulp.task('storybook', () => {
    // 生成 storybook 的配置文件
    genStorybook(projectPath)

    InitStoryConfig(projectPath, pkg)
    
    storybook({
      mode: 'dev',
      port: '9001',
      configDir: path.join(__dirname, '../storybook/'),
    })
  })
}
