/**
 * Copyright (c) 2019 z2o-react
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const gulp = require('gulp')
const babel = require('gulp-babel')
const getBabelConfig = require('./getBabelConfig')

// ============================== Clean ==============================
const cleanTasks = require('./gulpTasks/cleanTasks')

cleanTasks(gulp)

function babelCompile(modules) {
  const babelConfig = getBabelConfig(modules)
  return gulp
    .src(['src/**/*.{ts,tsx}'])
    .pipe(babel(babelConfig))
    .pipe(gulp.dest(modules === false ? 'es' : 'lib'))
}

gulp.task('js', () => {
  console.log('[Parallel] compile js...')
  return babelCompile('commonjs')
})

gulp.task('es', () => {
  console.log('[Parallel] compile es...')
  return babelCompile(false)
})

gulp.task('compile', gulp.series('cleanCompile', gulp.parallel('js', 'es')))
