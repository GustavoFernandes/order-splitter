var src = ['src/**', 'sw/**'];
var deployDir = 'docs';

var gulp = require('gulp');
var clean = require('gulp-clean');

gulp.task('clean', function() {
    return gulp.src(deployDir)
        .pipe(clean());
});

gulp.task('copy', ['clean'], function() {
    return gulp.src(src)
        .pipe(gulp.dest(deployDir));
});
