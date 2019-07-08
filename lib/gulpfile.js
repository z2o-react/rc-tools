const gulp = require('gulp')

gulp.task('somename', function(done) {
  console.log(1234)
})

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
  console.log('default')
})
