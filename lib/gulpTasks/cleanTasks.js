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

function registerTasks(gulp) {
  gulp.task(
    'cleanCompile',
    gulp.series((done) => {
      cleanCompile()
      done()
    }),
  )
}

module.exports = registerTasks
