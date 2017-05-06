const deployDir = './dist';

const copyTheseFilesToDist = [
  './webclient/*.ico',
  './webclient/*.png'
];

const dontVulcanizeTheseFiles = [
  './webclient/sw.js'
];

var babel = require('gulp-babel');
var browserSync = require('browser-sync');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var crisper = require('gulp-crisper');
var debug = require('gulp-debug');
var filter = require('gulp-filter');
var ghPages = require('gulp-gh-pages');
var git = require('git-rev-sync');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var minifyCss = require('gulp-clean-css');
var minifyHtml = require('gulp-minify-html');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var vulcanize = require('gulp-vulcanize');

gulp.task('default', ['vulcanize', 'copy-files']);

gulp.task('copy-files', ['clean'], function() {
  return gulp.src([...dontVulcanizeTheseFiles, ...copyTheseFilesToDist], {base: './webclient'})
    .pipe(debug('copied files'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('vulcanize', ['clean'], function() {

  var jsFilter = filter(['**/*.js'], {restore: true});
  var htmlFilter = filter(['**/*.html'], {restore: true});
  var version = JSON.parse(require('fs').readFileSync('./package.json')).version;
  var gitsha = git.short();
  var timestamp = "" + new Date();

  return gulp.src('./webclient/index.html').pipe(vulcanize({
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

    .pipe(replace("INSERT_VERSION", version))
    .pipe(replace("INSERT_SHA", gitsha))
    .pipe(replace("INSERT_BUILD_TIME", timestamp))
    .pipe(gulp.dest(deployDir));
});

gulp.task('clean', function () {
  return gulp.src(deployDir)
      .pipe(clean());
});

gulp.task('lint', function () {
  return gulp.src(['gulpfile.js, ./webclient/**.js'])
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
      baseDir: './webclient/'
    },
    notify: false
  });
  gulp.watch(['./webclient/*'], browserSync.reload);
});

gulp.task('serve-dist', ['default'], function() {
  browserSync({
    server: {
      baseDir: './dist/'
    },
    notify: false
  });
  gulp.watch(['./webclient/*'], ['default', browserSync.reload]);
});
