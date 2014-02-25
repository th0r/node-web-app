var path = require('path');
var spawn = require('child_process').spawn;
var pkg = require('./package.json');
var gulp = require('gulp');
var es = require('event-stream');
var util = require('gulp-util');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var gzip = require('gulp-zopfli');
var browserify = require('gulp-browserify');
var exposify = require('exposify');
var bowerScripts = require('gulp-bower-files');
var stylus = require('gulp-stylus');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var nodemon = require('nodemon');
var isProd = util.env.production;

exposify.config = {
    jquery: '$',
    vue: 'Vue',
    lodash: '_'
};

var src = {
    scripts: {
        app: {
            main: ['app/scripts/main/**/*.js'],
            all: ['app/scripts/**/*.js']
        }
    },
    styles: {
        app: {
            main: ['app/styles/**/*.{styl,css}', '!app/styles/**/includes/*.{styl,css}'],
            all: ['app/styles/**/*.{styl,css}']
        },
        vendor: []
    },
    img: {
        app: ['app/styles/**/img/*.*'],
        vendor: []
    },
    fonts: {
        app: ['app/styles/**/fonts/*.*'],
        vendor: []
    }
};

var dest = {
    scripts: {
        app: 'public/app/js',
        vendor: 'public/vendor/js'
    },
    styles: {
        app: 'public/app/css',
        vendor: 'public/vendor/css'
    },
    img: {
        app: 'public/app/img',
        vendor: 'public/vendor/img'
    },
    fonts: {
        app: 'public/app/fonts',
        vendor: 'public/vendor/fonts'
    }
};

// ==================================== Default ====================================

gulp.task('default', ['server']);

// ==================================== Server ====================================

gulp.task('server', ['build'], function () {
    var nodeDebugArgs;

    if (isProd) {
        process.env.NODE_ENV = 'production';
        spawn('node', ['.'], {
            stdio: 'inherit'
        });
    } else {
        // Watching for scripts
        gulp.watch(src.scripts.app.all, ['scripts.app']);
        gulp.watch(src.scripts.vendor, ['scripts.vendor']);

        // Watching for styles
        gulp.watch(src.styles.app.all, ['styles.app']);
        gulp.watch(src.styles.vendor, ['styles.vendor']);

        // Making node debug arguments
        if (util.env['debug-brk']) {
            nodeDebugArgs = ['--debug-brk'];
        } else if (util.env.debug) {
            nodeDebugArgs = ['--debug'];
        }

        nodemon(
            {
                script: pkg.main,
                nodeArgs: nodeDebugArgs,
                ext: 'js json',
                ignore: [
                    '.git',
                    'node_modules/**/node_modules',
                    'gulpfile.js',
                    'app/scripts',
                    'public',
                    'vendor'
                ]
            })
            .on('restart', function (files) {
                var changedFiles = files
                    .map(function (file) {
                        return '"' + path.relative(__dirname, file) + '"';
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
    return gulp
        .src(src.scripts.app.main)
        .pipe(browserify({
            transform: [exposify],
            debug: !isProd
        }))
        .pipe(rename(function (path) {
            path.basename = path.basename.replace(/Page$/, '');
        }))
        .pipe(gulpif(isProd, uglify()))
        .pipe(gulp.dest(dest.scripts.app));
});

gulp.task('scripts.vendor', ['clean.scripts.vendor'], function () {
    return es.concat(
            bowerScripts()
                .pipe(rename(function (path) {
                    // Taking root directory name as the name of the script
                    path.basename = path.dirname.split('/')[0];
                    path.dirname = '';
                })),
            gulp.src(['vendor/**/*.*', '!vendor/bower/**/*.*'])
        )
        .pipe(gulpif(function (file) {
            // Do not minimize if filename ends with ".min.js"
            return isProd && !/\.min\.js$/.test(file.path);
        }, uglify()))
        .pipe(rename(function (path) {
            // Removing ".min" part from filenames
            path.basename = path.basename.replace(/\.min$/, '');
        }))
        .pipe(gulp.dest(dest.scripts.vendor));
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

gulp.task('styles', ['styles.app', 'styles.vendor', 'fonts.app', 'fonts.vendor', 'img.app', 'img.vendor']);

gulp.task('styles.app', ['clean.styles.app'], function () {
    return gulp
        .src(src.styles.app.main)
        .pipe(gulpif(/\.styl$/, stylus({
            use: ['nib'],
            set: ['include css'].concat(isProd ? [] : ['firebug', 'linenos'])
        })))
        .pipe(gulpif(isProd, csso()))
        .pipe(gulp.dest(dest.styles.app));
});

gulp.task('styles.vendor', ['clean.styles.vendor'], function () {
    var files = src.styles.vendor;

    if (files.length) {
        return gulp
            .src(files)
            .pipe(gulpif(isProd, csso()))
            .pipe(gulp.dest(dest.styles.vendor));
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

gulp.task('fonts.app', ['clean.fonts.app'], function () {
    var files = src.fonts.app;

    if (files.length) {
        return gulp
            .src(src.fonts.app)
            .pipe(rename(function (path) {
                // Removing tailing "/fonts" directory
                path.dirname = path.dirname.replace(/\/?fonts$/, '');
            }))
            .pipe(gulp.dest(dest.fonts.app));
    }
});

gulp.task('clean.fonts.app', function () {
    return gulp
        .src(dest.fonts.app, {
            read: false
        })
        .pipe(clean());
});

gulp.task('fonts.vendor', ['clean.fonts.vendor'], function () {
    var files = src.fonts.vendor;

    if (files.length) {
        return gulp
            .src(files)
            .pipe(gulp.dest(dest.fonts.vendor));
    }
});

gulp.task('clean.fonts.vendor', function () {
    return gulp
        .src(dest.fonts.vendor, {
            read: false
        })
        .pipe(clean());
});

gulp.task('img.app', ['clean.img.app'], function () {
    var files = src.img.app;

    if (files.length) {
        return gulp
            .src(src.img.app)
            .pipe(rename(function (path) {
                // Removing tailing "/img" directory
                path.dirname = path.dirname.replace(/\/?img$/, '');
            }))
            .pipe(gulpif(isProd, imagemin()))
            .pipe(gulp.dest(dest.img.app));
    }
});

gulp.task('clean.img.app', function () {
    return gulp
        .src(dest.img.app, {
            read: false
        })
        .pipe(clean());
});

gulp.task('img.vendor', ['clean.img.vendor'], function () {
    var files = src.img.vendor;

    if (files.length) {
        return gulp
            .src(files)
            .pipe(gulp.dest(dest.img.vendor));
    }
});

gulp.task('clean.img.vendor', function () {
    return gulp
        .src(dest.img.vendor, {
            read: false
        })
        .pipe(clean());
});