var path = require('path');
var spawn = require('child_process').spawn;
var pkg = require('./package.json');
var gulp = require('gulp');
var es = require('event-stream');
var gutil = require('gulp-util');
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
var concatCSS = require('gulp-concat-css');
var imagemin = require('gulp-imagemin');
var nodemon = require('nodemon');
var isProd = gutil.env.production || (process.env.NODE_ENV === 'production' && !gutil.env.dev);

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
            main: ['app/styles/**/*.{styl,css}', '!app/styles/**/includes/**/*.{styl,css}'],
            all: ['app/styles/**/*.{styl,css}']
        },
        vendor: []
    },
    img: {
        app: ['app/styles/**/*.{jpeg,jpg,gif,png}'],
        vendor: []
    },
    fonts: {
        app: ['app/styles/**/*.{woff,ttf,otf,eot,svg}'],
        vendor: []
    }
};

var dest = {
    scripts: {
        app: 'public/app/scripts',
        vendor: 'public/vendor/scripts'
    },
    assets: {
        app: 'public/app/styles',
        vendor: 'public/vendor/styles'
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
        if (gutil.env['debug-brk']) {
            nodeDebugArgs = ['--debug-brk'];
        } else if (gutil.env.debug) {
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

gulp.task('build', ['scripts', 'assets'], function () {
    if (isProd) {
        // Pre-gzipping assets
        gutil.log('Pre-compressing static files...');

        return gulp
            .src('**/*.{js,css,ttf,svg}', {
                cwd: 'public'
            })
            .pipe(gzip())
            .pipe(gulp.dest('public'))
            .on('end', function () {
                gutil.log('Static files have been precompressed');
            });
    }
});

// ==================================== Scripts ====================================

gulp.task('scripts', ['scripts.app', 'scripts.vendor']);

gulp.task('scripts.app', ['clean.scripts.app'], function () {
    return gulp
        .src(src.scripts.app.main, {
            // TODO: There is a bug either in "browserify" of "gulp-browserify", which doesn't allow to compile more than one
            // script (problem with overriden `basedir` option). It can be fixed with `read: false` option.
            read: false
        })
        .pipe(browserify({
            transform: [exposify],
            debug: !isProd
        }))
        .pipe(isProd ? uglify() : gutil.noop())
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

// ==================================== Assets ====================================

gulp.task('assets', ['styles.app', 'styles.vendor', 'fonts.app', 'fonts.vendor', 'img.app', 'img.vendor']);

gulp.task('styles.app', ['clean.styles.app'], function () {
    return gulp
        .src(src.styles.app.main)
        // Inline @import statements for "admin/styles.css" file
        .pipe(gulpif(/\/admin\/styles\.css$/, concatCSS('admin/styles.css')))
        // Compile *.styl files
        .pipe(gulpif(/\.styl$/, stylus({
            use: ['nib'],
            set: ['resolve url', 'include css'].concat(isProd ? [] : ['linenos'])
        })))
        .pipe(isProd ? csso() : gutil.noop())
        .pipe(gulp.dest(dest.assets.app));
});

gulp.task('styles.vendor', ['clean.styles.vendor'], function () {
    var files = src.styles.vendor;

    if (files.length) {
        return gulp
            .src(files)
            .pipe(isProd ? csso() : gutil.noop())
            .pipe(gulp.dest(dest.assets.vendor));
    }
});

gulp.task('clean.styles.app', function () {
    return gulp
        .src(dest.assets.app, {
            read: false
        })
        .pipe(clean());
});

gulp.task('clean.styles.vendor', function () {
    return gulp
        .src(dest.assets.vendor, {
            read: false
        })
        .pipe(clean());
});

gulp.task('fonts.app', ['clean.styles.app'], function () {
    var files = src.fonts.app;

    if (files.length) {
        return gulp
            .src(src.fonts.app)
            .pipe(gulp.dest(dest.assets.app));
    }
});

gulp.task('fonts.vendor', ['clean.styles.vendor'], function () {
    var files = src.fonts.vendor;

    if (files.length) {
        return gulp
            .src(files)
            .pipe(gulp.dest(dest.assets.vendor));
    }
});

gulp.task('img.app', ['clean.styles.app'], function () {
    var files = src.img.app;

    if (files.length) {
        return gulp
            .src(src.img.app)
            .pipe(isProd ? imagemin() : gutil.noop())
            .pipe(gulp.dest(dest.assets.app));
    }
});

gulp.task('img.vendor', ['clean.styles.vendor'], function () {
    var files = src.img.vendor;

    if (files.length) {
        return gulp
            .src(files)
            .pipe(gulp.dest(dest.assets.vendor));
    }
});