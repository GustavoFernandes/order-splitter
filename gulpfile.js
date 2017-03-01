var src = ['src/**', 'sw/**'];
var deployDir = 'docs';

var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var inject = require('gulp-inject');

gulp.task('default', ['clean', 'lint', 'index']);

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

gulp.task('scripts', ['clean'], function () {
  return gulp.src(src.map(function (path) {
    return path + '/*.js';
  }))
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(concat('all.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest(deployDir));
});

gulp.task('index', function () {
  var target = gulp.src('src/index.html');
  var sources = gulp.src(['src/**/*.js', 'src/**/*.css']);

  return target.pipe(inject(sources))
      .pipe(gulp.dest('src'));
});
