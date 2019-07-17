'use strict'

const gulp = require('gulp')
const glob = require('glob')
const babel = require('gulp-babel')
const postcss = require('gulp-postcss')
const ts = require('gulp-typescript')
const merge2 = require('merge2')
const getBabelConfig = require('./getBabelConfig')
const getTSConfig = require('./getTSConfig')
const argv = require('minimist')(process.argv.slice(2))

const src = argv.src || 'src'

// ========== Clean ==========
const cleanTasks = require('./gulpTasks/cleanTasks')

cleanTasks(gulp)

// ========== storybook ==========
const genStorybookTasks = require('./gulpTasks/storybookTasks')

genStorybookTasks(gulp)

// ========== js compile ==========
function babelCompile(js, modules) {
  const babelConfig = getBabelConfig(modules)
  let stream = js.pipe(babel(babelConfig))

  return stream.pipe(gulp.dest(modules !== false ? 'lib' : 'es'))
}

// ========== ts compile ==========
function tsCompile(modules) {
  const streams = []

  if (glob.sync('src/**/*.{ts,tsx}').length) {
    const tsConfig = getTSConfig()
    const tsResult = gulp.src([`${src}/**/*.ts`, `${src}/**/*.tsx`]).pipe(ts(tsConfig))

    streams.push(tsResult.dts.pipe(gulp.dest(modules === false ? 'es' : 'lib')))
    streams.push(babelCompile(tsResult.js, modules))
  } else {
    streams.push(babelCompile(gulp.src([`${src}/**/*.js`, `${src}/**/*.jsx`]), modules))
  }

  return merge2(streams)
}

// css compile
gulp.task('css', () => {
  const less = require('gulp-less')
  return gulp
    .src('assets/*.less')
    .pipe(less())
    .pipe(postcss([require('./getAutoprefixer')()]))
    .pipe(gulp.dest('assets'))
})

gulp.task('js', () => {
  console.log('[Parallel] compile js...')
  return tsCompile('commonjs')
})

gulp.task('es', () => {
  console.log('[Parallel] compile es...')
  return tsCompile(false)
})

gulp.task('compile', gulp.series('cleanCompile', gulp.parallel('js', 'es', 'css')))
