'use strict'

const gulp = require('gulp')
const babel = require('gulp-babel')
const ts = require('gulp-typescript')
const merge2 = require('merge2')
const getBabelConfig = require('./getBabelConfig')
const getTSConfig = require('./getTSConfig')
const argv = require('minimist')(process.argv.slice(2))

const src = argv.src || 'src'

// Clean
const cleanTasks = require('./gulpTasks/cleanTasks')

cleanTasks(gulp)

// compile
function tsCompile(modules) {
  const streams = []
  const tsConfig = getTSConfig()
  const babelConfig = getBabelConfig(modules)

  streams.push(
    gulp.src([`${src}/**/*.ts`, `${src}/**/*.tsx`])
      .pipe(ts(tsConfig))
      .dts.pipe(gulp.dest(modules === false ? 'es' : 'lib')),
  )

  streams.push(
    gulp.src([`${src}/**/*.ts`, `${src}/**/*.tsx`])
      .pipe(babel(babelConfig))
      .pipe(gulp.dest(modules === false ? 'es' : 'lib')),
  )

  return merge2(streams)
}

gulp.task('js', () => {
  console.log('[Parallel] compile js...')
  return tsCompile('commonjs')
})

gulp.task('es', () => {
  console.log('[Parallel] compile es...')
  return tsCompile(false)
})

gulp.task('compile', gulp.series('cleanCompile', gulp.parallel('js', 'es')))
