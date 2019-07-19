'use strict'

const gulp = require('gulp')
const glob = require('glob')
const chalk = require('chalk')
const babel = require('gulp-babel')
const postcss = require('gulp-postcss')
const ts = require('gulp-typescript')
const merge2 = require('merge2')
const shelljs = require('shelljs')
const getBabelConfig = require('./getBabelConfig')
const getTSConfig = require('./getTSConfig')
const resolveCwd = require('./resolveCwd')

const argv = require('minimist')(process.argv.slice(2))
const pkg = require(resolveCwd('package.json'))
const cwd = process.cwd()
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

  if (glob.sync(`${src}/**/*.{ts,tsx}`).length) {
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

// ========== publish ==========
gulp.task(
  'publish',
  gulp.series('compile', (done) => {
    if (!fs.existsSync(resolveCwd('lib')) || !fs.existsSync(resolveCwd('es'))) {
      return done('missing lib/es dir')
    }
    console.log(chalk.green('publishing...'))
    const beta = !pkg.version.match(/^\d+\.\d+\.\d+$/)
    let args = ['npm', 'publish']
    if (beta) {
      args = args.concat(['--tag', 'beta'])
    }

    let ret = shelljs.exec(args.join(' ')).code
    console.log('published')
    if (!ret) {
      ret = undefined
    }
    done(ret)
  }),
)

gulp.task(
  'pub',
  gulp.series('publish', 'gh-pages', (done) => {
    console.log(chalk.green('tagging...'))
    const { version } = pkg
    shelljs.cd(cwd)
    shelljs.exec(`git tag ${version}`)
    shelljs.exec(`git push origin ${version}:${version}`)
    shelljs.exec('git push origin master:master')
    console.log('tagged')
    done()
  }),
)
