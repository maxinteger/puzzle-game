var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat');

gulp.task('build', function () {
    return gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('game.js'))
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'));
});

gulp.task('dev', function() {
    gulp.watch('src/**/*.js', ['build']);
});

gulp.task('default', ['build']);
