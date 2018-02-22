require('dotenv').config()
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    url = require('url'),
    proxy = require('proxy-middleware'),
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
    var proxyOptions = url.parse('http://localhost:' + process.env.PORT + '/api')
    proxyOptions.route = '/api'
    console.log(JSON.stringify(proxyOptions, null, 4))
    browserSync.init({
        server: {
            baseDir: './build',
            middleware: proxy(proxyOptions)
        },
        startPath: './index.html'
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