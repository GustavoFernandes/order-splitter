var src = ['src/**', 'sw/**'];
var deployDir = 'docs';

var gulp = require('gulp');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');

gulp.task('default', ['copy']);

gulp.task('copy', ['clean', 'lint'], function () {
  return gulp.src(src)
      .pipe(gulp.dest(deployDir));
});

gulp.task('clean', function () {
  return gulp.src(deployDir)
      .pipe(clean());
});

gulp.task('lint', function () {
  return gulp.src(src.map(function (path) {
    return path + '/*.js';
  }))
      .pipe(jshint({
        eqeqeq: true,
        esversion: 6,
        eqnull: true
      }))
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('serve', function () {
  var browserSync = require('browser-sync');
  browserSync({
    server: {
      baseDir: './src/'
    },
    notify: false
  });
  gulp.watch(['./src/*'], browserSync.reload);
});
