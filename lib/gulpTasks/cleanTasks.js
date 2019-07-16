const fs = require('fs')
const shelljs = require('shelljs')
const resolveCwd = require('../resolveCwd')

function cleanCompile() {
  try {
    if (fs.existsSync(resolveCwd('lib'))) {
      console.log('Clean lib...')
      shelljs.rm('-rf', resolveCwd('lib'))
    }
    if (fs.existsSync(resolveCwd('es'))) {
      console.log('Clean es...')
      shelljs.rm('-rf', resolveCwd('es'))
    }
  } catch (err) {
    console.log('Clean up failed:', err)
    throw err
  }
}

function cleanBuild() {
  console.log('Clean build...')
  if (fs.existsSync(resolveCwd('build'))) {
    shelljs.rm('-rf', resolveCwd('build'))
  }
}

function registerTasks(gulp) {
  gulp.task(
    'cleanCompile',
    gulp.series((done) => {
      cleanCompile()
      done()
    }),
  )

  gulp.task(
    'cleanBuild',
    gulp.series((done) => {
      cleanBuild()
      done()
    }),
  )
}

module.exports = registerTasks
