var path = require('path');
var spawn = require('child_process').spawn;
var pkg = require('./package.json');
var gulp = require('gulp');
var util = require('gulp-util');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var nodemon = require('nodemon');
var isProd = util.env.production;

var src = {
    scripts: {
        app: [
            'app/client/**/*.js'
        ],
        vendor: [
            'vendor/jquery/' + (isProd ? 'jquery.min.js' : 'jquery.js')
        ]
    }
};

var dest = {
    scripts: {
        root: 'public/js',
        app: 'public/js/app',
        vendor: 'public/js/vendor'
    }
};

gulp.task('default', ['server']);

gulp.task('server', ['scripts'], function () {
    if (isProd) {
        process.env.NODE_ENV = 'production';
        spawn('node', ['.'], {
            stdio: 'inherit'
        });
    } else {
        gulp.watch(src.scripts.app, ['scripts.app']);
        gulp.watch(src.scripts.vendor, ['scripts.vendor']);

        nodemon(
            {
                script: pkg.main,
                ext: 'js json',
                ignore: [
                    'gulpfile.js',
                    'app/client',
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

gulp.task('scripts', ['scripts.app', 'scripts.vendor']);

gulp.task('scripts.app', ['clean.scripts.app'], function () {
    return gulp
        .src(src.scripts.app)
        .pipe(gulpif(isProd, uglify()))
        .pipe(gulp.dest(dest.scripts.app));
});

gulp.task('scripts.vendor', ['clean.scripts.vendor'], function () {
    return gulp.src(src.scripts.vendor)
        // Removing ".min" part from filenames in production
        .pipe(gulpif(isProd, rename(function (dir, base, ext) {
            return base.replace(/\.min$/, '') + ext;
        })))
        .pipe(gulp.dest(dest.scripts.vendor));
});

gulp.task('clean.scripts.app', function () {
    return gulp
        .src(dest.scripts.app)
        .pipe(clean());
});

gulp.task('clean.scripts.vendor', function () {
    return gulp
        .src(dest.scripts.vendor)
        .pipe(clean());
});

gulp.task('clean.scripts', function () {
    return gulp
        .src(dest.scripts.root)
        .pipe(clean());
});