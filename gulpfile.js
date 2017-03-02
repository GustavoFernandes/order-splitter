var src = ['src/**', 'sw/**'];
var deployDir = 'docs';

var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var inject = require('gulp-inject');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-clean-css');
var browserSync = require('browser-sync');
var injectVersion = require('gulp-inject-version');

gulp.task('default', ['lint']);

gulp.task('build', ['build-html']);

gulp.task('clean', function () {
  return gulp.src(deployDir)
      .pipe(clean());
});

gulp.task('lint', function () {
  var filesToLint = src.map(path => path + '/*.js');
  filesToLint.push('gulpfile.js');

  return gulp.src(filesToLint)
      .pipe(jshint({
        eqeqeq: true,
        esversion: 6,
        eqnull: true
      }))
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('build-js', ['clean'], function () {
  return gulp.src(src.map(path => path + '/*.js'))
      .pipe(injectVersion())
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(concat('all.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest(deployDir));
});

gulp.task('build-css', ['clean'], function () {
  return gulp.src('src/**/*.css')
      .pipe(minifyCss())
      .pipe(gulp.dest(deployDir));
});

gulp.task('build-html', ['build-js', 'build-css'], function () {
  var target = gulp.src('src/index.html');
  var sources = gulp.src(deployDir + '/*.{js,css}', {
    read: false
  });

  return target.pipe(inject(sources, {
    ignorePath: deployDir,
    addRootSlash: false
  }))
      .pipe(injectVersion())
      .pipe(minifyHtml())
      .pipe(gulp.dest(deployDir));
});

gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: './src/'
    },
    notify: false
  });
  gulp.watch(['./src/*'], browserSync.reload);
});
