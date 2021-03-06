var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var replace = require('gulp-replace-path');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

// Compile LESS files from /less into /css
gulp.task('less', function() {
    return gulp.src('less/sb-admin-2.less')
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src('dist/css/sb-admin-2.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy JS to dist
gulp.task('js', function() {
    return gulp.src(['js/sb-admin-2.js'])
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
})

// Minify JS
gulp.task('minify-js', ['js'], function() {
    return gulp.src('js/sb-admin-2.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /bower_components into /vendor
gulp.task('copy', function() {
    gulp.src(['bower_components/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('dist/assets/vendor/bootstrap'))

    gulp.src(['bower_components/bootstrap-social/*.css', 'bower_components/bootstrap-social/*.less', 'bower_components/bootstrap-social/*.scss'])
        .pipe(gulp.dest('dist/assets/vendor/bootstrap-social'))

    gulp.src(['bower_components/datatables/media/**/*'])
        .pipe(gulp.dest('dist/assets/vendor/datatables'))

    gulp.src(['bower_components/datatables-plugins/integration/bootstrap/3/*'])
        .pipe(gulp.dest('dist/assets/vendor/datatables-plugins'))

    gulp.src(['bower_components/datatables-responsive/css/*', 'bower_components/datatables-responsive/js/*'])
        .pipe(gulp.dest('dist/assets/vendor/datatables-responsive'))

    gulp.src(['bower_components/flot/*.js'])
        .pipe(gulp.dest('dist/assets/vendor/flot'))

    gulp.src(['bower_components/flot.tooltip/js/*.js'])
        .pipe(gulp.dest('dist/assets/vendor/flot-tooltip'))

    gulp.src(['bower_components/font-awesome/**/*', '!bower_components/font-awesome/*.json', '!bower_components/font-awesome/.*'])
        .pipe(gulp.dest('dist/assets/vendor/font-awesome'))

    gulp.src(['bower_components/jquery/dist/jquery.js', 'bower_components/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('dist/assets/vendor/jquery'))

    gulp.src(['bower_components/metisMenu/dist/*'])
        .pipe(gulp.dest('dist/assets/vendor/metisMenu'))

    gulp.src(['bower_components/morrisjs/*.js', 'bower_components/morrisjs/*.css', '!bower_components/morrisjs/Gruntfile.js'])
        .pipe(gulp.dest('dist/assets/vendor/morrisjs'))

    gulp.src(['bower_components/raphael/raphael.js', 'bower_components/raphael/raphael.min.js'])
        .pipe(gulp.dest('dist/assets/vendor/raphael'))
        
    gulp.src(['data/*'])
        .pipe(gulp.dest('dist/assets/data'))
        
    gulp.src(['pages/*.html'])
        .pipe(replace('../dist/assets/assets/', 'assets/'))
        .pipe(replace('../dist/assets/', 'assets/'))
        .pipe(replace("../vendor/", 'assets/vendor/'))
        .pipe(replace("../dist/", 'assets/'))
        .pipe(replace("../data/", 'assets/data/'))
        .pipe(gulp.dest('dist'))

})

// Run everything
gulp.task('default', ['minify-css', 'minify-js', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist/'
        },
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'js', 'minify-js'], function() {
    gulp.watch('less/*.less', ['less']);
    gulp.watch('dist/assets/css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('pages/*.html', browserSync.reload);
    gulp.watch('dist/assets/js/*.js', browserSync.reload);
});
