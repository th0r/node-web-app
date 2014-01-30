var path = require('path');
var spawn = require('child_process').spawn;
var pkg = require('./package.json');
var gulp = require('gulp');
var util = require('gulp-util');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var gzip = require('gulp-zopfli');
var browserify = require('gulp-browserify');
var exposify = require('exposify');
var stylus = require('gulp-stylus');
var csso = require('gulp-csso');
var nodemon = require('nodemon');
var isProd = util.env.production;

var src = {
    scripts: {
        app: [
            'app/pages/**/*.js'
        ],
        vendor: [
            'vendor/jquery/' + (isProd ? 'jquery.min.js' : 'jquery.js')
        ]
    },
    styles: {
        app: {
            main: ['app/styles/*.styl'],
            all: ['app/styles/**/*.styl']
        },
        vendor: []
    }
};

var dest = {
    scripts: {
        app: 'public/js/app',
        vendor: 'public/js/vendor'
    },
    styles: {
        app: 'public/css/app',
        vendor: 'public/css/vendor'
    }
};

// ==================================== Default ====================================

gulp.task('default', ['server']);

// ==================================== Server ====================================

gulp.task('server', ['build'], function () {
    if (isProd) {
        process.env.NODE_ENV = 'production';
        spawn('node', ['.'], {
            stdio: 'inherit'
        });
    } else {
        // Watching for scripts
        gulp.watch(src.scripts.app, ['scripts.app']);
        gulp.watch(src.scripts.vendor, ['scripts.vendor']);

        // Watching for styles
        gulp.watch(src.styles.app.all, ['styles.app']);
        gulp.watch(src.styles.vendor, ['styles.vendor']);

        nodemon(
            {
                script: pkg.main,
                ext: 'js json',
                ignore: [
                    'gulpfile.js',
                    'app/pages',
                    'public',
                    'vendor'
                ]
            })
            .on('restart', function (files) {
                var changedFiles = files
                    .map(function (file) {
                        return '"' + path.relative('app', file) + '"';
                    })
                    .join(', ');

                console.log('Server restarted because of changes in', changedFiles);
            });
    }
});

// ==================================== Build ====================================

gulp.task('build', ['scripts', 'styles']);

// ==================================== Scripts ====================================

gulp.task('scripts', ['scripts.app', 'scripts.vendor']);

gulp.task('scripts.app', ['clean.scripts.app'], function () {
    exposify.config = { jquery: '$' };

    return gulp
        .src(src.scripts.app)
        .pipe(browserify({
            transform: [exposify],
            debug: !isProd
        }))
        .pipe(gulpif(isProd, uglify()))
        .pipe(gulp.dest(dest.scripts.app))
        .pipe(gulpif(isProd, gzip()))
        .pipe(gulpif(isProd, gulp.dest(dest.scripts.app)));
});

gulp.task('scripts.vendor', ['clean.scripts.vendor'], function () {
    return gulp.src(src.scripts.vendor)
        // Removing ".min" part from filenames in production
        .pipe(gulpif(isProd, rename(function (dir, base, ext) {
            return base.replace(/\.min$/, '') + ext;
        })))
        .pipe(gulp.dest(dest.scripts.vendor))
        .pipe(gulpif(isProd, gzip()))
        .pipe(gulpif(isProd, gulp.dest(dest.scripts.vendor)));
});

gulp.task('clean.scripts.app', function () {
    return gulp
        .src(dest.scripts.app, {
            read: false
        })
        .pipe(clean());
});

gulp.task('clean.scripts.vendor', function () {
    return gulp
        .src(dest.scripts.vendor, {
            read: false
        })
        .pipe(clean());
});

// ==================================== Styles ====================================

gulp.task('styles', ['styles.app', 'styles.vendor']);

gulp.task('styles.app', ['clean.styles.app'], function () {
    return gulp
        .src(src.styles.app.main)
        .pipe(stylus({
            use: ['nib'],
            set: isProd ? null : ['firebug', 'linenos']
        }))
        .pipe(gulpif(isProd, csso()))
        .pipe(gulp.dest(dest.styles.app))
        .pipe(gulpif(isProd, gzip()))
        .pipe(gulpif(isProd, gulp.dest(dest.styles.app)));
});

gulp.task('styles.vendor', ['clean.styles.vendor'], function () {
    var files = src.styles.vendor;

    if (files.length) {
        return gulp
            .src(files)
            .pipe(gulpif(isProd, csso()))
            .pipe(gulp.dest(dest.styles.vendor))
            .pipe(gulpif(isProd, gzip()))
            .pipe(gulpif(isProd, gulp.dest(dest.styles.vendor)));
    }
});

gulp.task('clean.styles.app', function () {
    return gulp
        .src(dest.styles.app, {
            read: false
        })
        .pipe(clean());
});

gulp.task('clean.styles.vendor', function () {
    return gulp
        .src(dest.styles.vendor, {
            read: false
        })
        .pipe(clean());
});