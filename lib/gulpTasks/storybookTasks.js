const path = require('path')
const storybook = require('@storybook/react/standalone')
const genStorybook = require('../genStorybook')
const InitStoryConfig = require('../initStorybookConfig')
const resolveCwd = require('../resolveCwd')

const projectPath = resolveCwd('./')
const pkg = require(resolveCwd('package.json'))

function storybookBuild(done) {
  console.log('[storybook] building...')
  // 生成 storybook 的配置文件
  genStorybook(projectPath)

  InitStoryConfig(projectPath, pkg)

  storybook({
    mode: 'static',
    // 相对路径，storybook 会自动拼接 cmd 所在的位置
    outputDir: './build',
    configDir: path.join(__dirname, '../storybook/'),
  }).then(done)
}

module.exports = function(gulp) {
  gulp.task('storybook', () => {
    // 生成 storybook 的配置文件
    genStorybook(projectPath)

    InitStoryConfig(projectPath, pkg)

    storybook({
      mode: 'dev',
      port: '9060',
      configDir: path.join(__dirname, '../storybook/'),
    })
  })

  // ====================== Export =======================
  gulp.task(
    'build',
    gulp.series('cleanBuild', (done) => {
      storybookBuild(done)
    }),
  )
}
