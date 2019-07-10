'use strict'

const gulp = require('gulp')
const babel = require('gulp-babel')
const ts = require('gulp-typescript')
const getBabelConfig = require('./getBabelConfig')
const tsConfig = require('./getTSConfig')()
const argv = require('minimist')(process.argv.slice(2))

const src = argv.src || 'src'

// ============================== Clean ==============================
const cleanTasks = require('./gulpTasks/cleanTasks')

cleanTasks(gulp)

function babelCompile(modules) {
  const babelConfig = getBabelConfig(modules)
  return gulp
    .src([`${src}/**/*.{ts,tsx}`])
    .pipe(babel(babelConfig))
    .pipe(gulp.dest(modules === false ? 'es' : 'lib'))
}

function tsCompile(modules) {
  return (
    gulp
      .src([`${src}/**/*.ts`, `${src}/**/*.tsx`])
      // .pipe(require('gulp-debug')())
      .pipe(ts(tsConfig))
      .dts.pipe(gulp.dest(modules === false ? 'es' : 'lib'))
  )
}

gulp.task('js', (done) => {
  console.log('[Parallel] compile js...')
  tsCompile('commonjs')
  babelCompile('commonjs')
  done()
})

gulp.task('es', (done) => {
  console.log('[Parallel] compile es...')
  tsCompile(false)
  babelCompile(false)
  done()
})

gulp.task('compile', gulp.series('cleanCompile', gulp.parallel('js', 'es')))
