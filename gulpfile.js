var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jade = require('gulp-jade');
var minifyCSS = require('gulp-minify-css');

// lint task
gulp.task('lint', function() {
    return gulp.src('app/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// concatenate and minify js
gulp.task('scripts', function() {
    return gulp.src(['app/js/sudoku.js', 'app/js/app.js'])
        .pipe(concat('digit.js'))
        .pipe(gulp.dest('app/js/dist'))
        .pipe(rename('digit.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js/dist'));
});

// concatenate and minify css
gulp.task('minify-css', function() {
  return gulp.src(['app/css/elem.css','app/css/digit.css'])
    .pipe(concat('digit.css'))
    .pipe(gulp.dest('app/css/dist'))
    .pipe(rename('digit.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('app/css/dist'));
});

// jade to html
gulp.task('templates', function() {
  var YOUR_LOCALS = {};

  gulp.src('*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./'))
});

// watch files for changes
gulp.task('watch', function() {
    gulp.watch('app/js/*.js', ['lint', 'scripts']);
    gulp.watch('app/css/*.css', ['minify-css']);
    gulp.watch('*.jade', ['templates']);
});

// default task
gulp.task('default', ['lint', 'scripts', 'minify-css', 'templates', 'watch']);
