var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create()

var DEST = 'views/static'

gulp.task('scripts', function() {
    return gulp.src([
        'assets/js/helpers/*.js',
        'assets/js/*.js',
    ])
        .pipe(concat('custom.js'))
        .pipe(gulp.dest(DEST+'/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(DEST+'/js'))
        .pipe(browserSync.stream())
})

// TODO: Maybe we can simplify how sass compile the minify and unminify version
var compileSASS = function (filename, options) {
    return sass('assets/scss/*.scss', options)
        .pipe(autoprefixer('last 2 versions', '> 5%'))
        .pipe(concat(filename))
        .pipe(gulp.dest(DEST+'/css'))
        .pipe(browserSync.stream())
}

gulp.task('sass', function() {
    return compileSASS('custom.css', {})
})

gulp.task('sass-minify', function() {
    return compileSASS('custom.min.css', {style: 'compressed'})
})

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: './views/index.html'
    })
})

gulp.task('watch', function() {
    // Watch .html files
    gulp.watch('views/*.html', browserSync.reload)
    // Watch .js files
    gulp.watch('assets/js/*.js', ['scripts'])
    // Watch .scss files
    gulp.watch('assets/scss/*.scss', ['sass', 'sass-minify'])
})

// Default Task
gulp.task('default', ['browser-sync', 'watch'])