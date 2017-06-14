const deployDir = './dist';
let DEPLOY = true;

const copyTheseFilesToDist = [
    './webclient/*.ico',
    './webclient/*.png',
    './common/app-icon/*',
    './webclient/manifest.json',
    './webclient/sw.js'
];

const orderData = [
    './data/*',
    './images/*'
];

const dontVulcanizeTheseFiles = [
    './bower_components/webcomponentsjs/custom-elements-es5-adapter.js'
];

var babel = require('gulp-babel');
var browserSync = require('browser-sync');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var crisper = require('gulp-crisper');
var debug = require('gulp-debug');
var eslint = require('gulp-eslint');
var eslintConfig = require('./.eslint.json');
var filter = require('gulp-filter');
var ghPages = require('gulp-gh-pages');
var git = require('git-rev-sync');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var merge = require('gulp-merge');
var minifyCss = require('gulp-clean-css');
var minifyHtml = require('gulp-minify-html');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var vulcanize = require('gulp-vulcanize');

var version = JSON.parse(require('fs').readFileSync('./package.json')).version;

gulp.task('default', ['vulcanize', 'copy-files']);

gulp.task('copy-files', ['clean'], function() {
    return merge(
        gulp.src([...orderData, ...dontVulcanizeTheseFiles], {base: './'})
            .pipe(gulp.dest(deployDir)),
        gulp.src([...copyTheseFilesToDist])
            .pipe(replace('INSERT_SHA', git.short()))
            .pipe(debug('copied files'))
            .pipe(gulp.dest(deployDir))
    );
});

gulp.task('vulcanize', ['clean'], function() {

    var jsFilter = filter(['**/*.js'], {restore: true});
    var htmlFilter = filter(['**/*.html'], {restore: true});

    return gulp.src('./webclient/index.html')
        .pipe(vulcanize({
            excludes: dontVulcanizeTheseFiles,
            stripComments: true,
            inlineCss: true,
            inlineScripts: true
        }))
        .pipe(gulpif(!DEPLOY, replace(/.*custom-elements-es5-adapter.*/g, '')))
        .pipe(crisper({
            scriptInHead: false
        }))

        .pipe(htmlFilter)
        .pipe(minifyHtml())

        .pipe(htmlFilter.restore)

        .pipe(jsFilter)
        .pipe(gulpif(DEPLOY, babel({
            presets: ['es2015'],
            plugins: [
                'async-to-promises'
            ],
            ignore: [
                '*custom-elements-es5-adapter.js'
            ],
            compact: true
        })))

        .pipe(jsFilter.restore)

        .pipe(replace('INSERT_VERSION', version))
        .pipe(replace('INSERT_SHA', git.short()))
        .pipe(replace('INSERT_BUILD_TIME', new Date().toLocaleString()))
        .pipe(gulp.dest(deployDir));
});

gulp.task('clean', function () {
    return gulp.src(deployDir)
      .pipe(clean());
});

const extDir = './ext-dist/';

gulp.task('ext', ['clean-ext', 'default'], function() {
    return gulp.src([deployDir+'/**', './chrome_extension/*', './common/order.js'])
        .pipe(debug('extension files'))
        .pipe(gulp.dest(extDir));
});

gulp.task('clean-ext', function() {
    return gulp.src(extDir).pipe(clean());
});

gulp.task('lint', function () {
    function isFixed(file) {
        return file.eslint != null && file.eslint.fixed;
    }
    return gulp.src([
        './**/*.js', 
        '!./dist/**.js', 
        '!./ext-dist/**.js',
        '!./node_modules/**', 
        '!./bower_components'
    ], {base: './'})
        .pipe(eslint(eslintConfig))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(gulpif(isFixed, gulp.dest('.')));
});

gulp.task('gh-deploy', ['switch-to-src','default'], () => {
    return gulp.src(deployDir+'/**')
        .pipe(ghPages({
            remote: 'origin',
            branch: 'gh-pages'
        }));
});

gulp.task('serve', ['switch-to-src', 'default'], function() {
    browserSync({
        server: {
            baseDir: deployDir
        },
        notify: false
    });
    gulp.watch([
        './webclient/*', 
        './common/*',
        './elements/*',
        './data/*'
    ], ['switch-to-src', 'default', browserSync.reload]);
});

gulp.task('switch-to-src', function() {
    DEPLOY = false;
});
