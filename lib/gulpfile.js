const gulp = require('gulp')

// ============================== Clean ==============================
const cleanTasks = require('./gulpTasks/cleanTasks')

cleanTasks(gulp)

gulp.task('js', () => {
  console.log('[Parallel] compile js...')
  // return babelify();
})

gulp.task('es', () => {
  console.log('[Parallel] compile es...')
  // return babelify(false);
})

gulp.task('compile', gulp.series('cleanCompile', gulp.parallel('js', 'es')))
