var src = ['src/**'];
var deployDir = 'docs';

var gulp = require('gulp');

gulp.task('copy', function() {
    return gulp.src(src)
        .pipe(gulp.dest(deployDir));
});
