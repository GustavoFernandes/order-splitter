const deployDir = './dist';

const copyTheseFilesToDist = [
  './src/*.png'
];

const dontVulcanizeTheseFiles = [];

var babel = require('gulp-babel');
var browserSync = require('browser-sync');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var crisper = require('gulp-crisper');
var debug = require('gulp-debug');
var filter = require('gulp-filter');
var ghPages = require('gulp-gh-pages');
var gulp = require('gulp');
var inject = require('gulp-inject');
var injectVersion = require('gulp-inject-version');
var jshint = require('gulp-jshint');
var minifyCss = require('gulp-clean-css');
var minifyHtml = require('gulp-minify-html');
var uglify = require('gulp-uglify');
var vulcanize = require('gulp-vulcanize');

gulp.task('default', ['vulcanize', 'copy-files']);

gulp.task('copy-files', ['clean'], function() {
    gulp.src(['sw/sw.js'])
        .pipe(gulp.dest('./dist/'));
  return gulp.src([...dontVulcanizeTheseFiles, ...copyTheseFilesToDist], {base: './src'})
    .pipe(debug('copied files'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('vulcanize', ['clean'], function() {

  var jsFilter = filter(['**/*.js'], {restore: true});
  var htmlFilter = filter(['**/*.html'], {restore: true});

  return gulp.src('./src/index.html').pipe(vulcanize({
    excludes: dontVulcanizeTheseFiles,
    stripComments: true,
    inlineCss: true,
    inlineScripts: true
  }))
    .pipe(crisper())

    .pipe(htmlFilter)
    .pipe(minifyHtml())
    .pipe(htmlFilter.restore)

    .pipe(jsFilter)
    .pipe(babel({
      presets: ["es2015"],
      compact: true
    }))
    .pipe(jsFilter.restore)

    .pipe(injectVersion())
    .pipe(gulp.dest(deployDir));
});

gulp.task('clean', function () {
  return gulp.src(deployDir)
      .pipe(clean());
});

gulp.task('lint', function () {
  return gulp.src(['gulpfile.js, ./src/**.js'])
      .pipe(jshint({
        eqeqeq: true,
        esversion: 6,
        eqnull: true
      }))
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('gh-deploy', ['default'], () => {
  return gulp.src(deployDir+'/**')
    .pipe(ghPages({
      remote: "origin",
      branch: "gh-pages"
    }));
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
