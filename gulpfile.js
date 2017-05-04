const deployDir = 'dist';
const srcList = ['src/**', 'sw/**'];

const copyTheseFilesToDist = [
  './src/*.png'
];

const dontVulcanizeTheseFiles = [
  './src/sw/*.js'
];

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
  gulp.src([...dontVulcanizeTheseFiles, ...copyTheseFilesToDist], {base: "./src"})
    .pipe(debug('copied files'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('vulcanize', ['clean'], function() {

  var jsFilter = filter(['**/*.js'], {restore: true});
  var htmlFilter = filter(['**/*.html'], {restore: true});

  gulp.src('./src/index.html').pipe(vulcanize({
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

gulp.task('build', ['build-html', 'build-sw']);

gulp.task('clean', function () {
  return gulp.src(deployDir)
      .pipe(clean());
});

gulp.task('lint', function () {
  var filesToLint = srcList.map(path => path + '/*.js');
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

gulp.task('gh-deploy', ['build'], () => {
  return gulp.src(deployDir + '/**/*')
    .pipe(ghPages({
      remote: "origin",
      branch: "gh-pages"
    }));
});

gulp.task('build-js', ['clean'], function () {
  return gulp.src(['./src/**/*.js', './sw/install.js'])
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

gulp.task('build-extension', ['clean'], function () {
  return gulp.src(['src/manifest.json', 'src/icon.png'])
      .pipe(gulp.dest(deployDir));
});

gulp.task('build-html', ['build-js', 'build-css', 'build-extension'], function () {
  // Inject references of every JS and CSS file in the deploy directory (excluding sw.js) into index.html.
  var target = gulp.src('src/index.html');
  var sources = gulp.src(['!' + deployDir + '/sw.js', deployDir + '/*.{js,css}',], {
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

gulp.task('build-sw', ['clean'], function () {
  return gulp.src('./sw/sw.js')
      .pipe(injectVersion())
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(uglify())
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
