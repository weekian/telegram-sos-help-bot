require('dotenv').config()
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    proxy = require('proxy-middleware'),
    url = require('url')

var htmlDest = 'public/build'
var assetsDest = 'public/build/static'
var assetsSrc = 'public/src'


gulp.task('scripts', function() {
    return gulp.src(assetsSrc + '/js/*.js')
        .pipe(concat('custom.js'))
        .pipe(gulp.dest(assetsDest+'/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(assetsDest+'/js'))
        .pipe(browserSync.stream())
})

var compileSASS = function (filename, options) {
    return sass(assetsSrc + '/scss/*.scss', options)
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
    browserSync.init({
        server: {
            baseDir: './public/build',
            middleware: proxy(proxyOptions)
        },
        startPath: './index.html'
    })
})

gulp.task('html', function(){
    return gulp.src(assetsSrc + '/*.html')
        .pipe(gulp.dest(htmlDest))
})

gulp.task('watch', function() {
    // Watch .html files
    gulp.watch(assetsSrc + '/*.html', ['html', browserSync.reload])
    // Watch .js files
    gulp.watch(assetsSrc + '/js/*.js', ['scripts'])
    // Watch .scss files
    gulp.watch(assetsSrc + '/scss/*.scss', ['sass', 'sass-minify'])
})

// Default Task
gulp.task('default', ['watch', 'browser-sync'])