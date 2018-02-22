var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create()

var htmlDest = 'build/'
var assetsDest = 'build/static'

gulp.task('scripts', function() {
    return gulp.src([
        'views/js/helpers/*.js',
        'views/js/*.js',
    ])
        .pipe(concat('custom.js'))
        .pipe(gulp.dest(assetsDest+'/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(assetsDest+'/js'))
        .pipe(browserSync.stream())
})

// TODO: Maybe we can simplify how sass compile the minify and unminify version
var compileSASS = function (filename, options) {
    return sass('views/scss/*.scss', options)
        .pipe(autoprefixer('last 2 versions', '> 5%'))
        .pipe(concat(filename))
        .pipe(gulp.dest(assetsDest+'/css'))
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
        startPath: './build/index.html'
    })
})

gulp.task('html', function(){
    return gulp.src('views/*.html')
        .pipe(gulp.dest(htmlDest))
})

gulp.task('watch', function() {
    // Watch .html files
    gulp.watch('views/*.html', ['html',browserSync.reload])
    // Watch .js files
    gulp.watch('views/js/*.js', ['scripts'])
    // Watch .scss files
    gulp.watch('views/scss/*.scss', ['sass', 'sass-minify'])
})

// Default Task
gulp.task('default', ['browser-sync', 'watch'])