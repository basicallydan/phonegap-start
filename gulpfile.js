var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var styl = require('gulp-styl');
// var sass = require('gulp-sass');
var sass = require('gulp-ruby-sass');
var path = require('path');
var o = require('open');
var ripple = require('ripple-emulator');
var webPath = function (p) { return path.join('./www/', p); };
var exec = require('exec');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
// require('./www/js/utils/handlebarHelpers');

gulp.task('tests', function (done) {
    gulp.src('./www/spec/**/*.test.js')
        .pipe(mocha({reporter: 'nyan'}))
        .on('error', function (e) {
            gutil.log(e);
            done();
        });
});

// Builds the scripts based on a single entry point using browserify
gulp.task('scripts', function(done) {
    return gulp.src([webPath('js/index.js')])
        .pipe(browserify({
            transform: ['hbsfy'],
            debug:true,
            insertGlobals: true
        }))
        .pipe(gulp.dest(webPath('build')))
        .on('error', function (e) {
            gutil.log(e);
            done();
        });
});

// Concatenates all the CSS files together.
gulp.task('styles', function(done) {
    return gulp.src(webPath('sass/main.scss'))
        .pipe(sass())
        .pipe(gulp.dest(webPath('build')));
        // .pipe(styl({
        //     compress: true
        // }))
});

gulp.task('refresh', ['styles', 'scripts'], function(done) {
    exec('cordova prepare', function () {
        gutil.log('Files copied to all device folders folder');
        done();
    });
});

gulp.task('refresh-ios', ['styles', 'scripts'], function(done) {
    exec('cordova prepare --platform ios', function () {
        gutil.log('Files copied to ios folder');
        done();
    });
});

gulp.task('refresh-android', ['styles', 'scripts'], function(done) {
    exec('cordova prepare --platform ios', function () {
        gutil.log('Files copied to ios folder');
        done();
    });
});

gulp.task('run-android', ['styles', 'scripts'], function (done) {
    exec('cordova run android --device', function () {
        gutil.log('Running on android');
        done();
    });
});

gulp.task('run-ios', ['styles', 'scripts'], function (done) {
    exec('cordova run ios --device', function () {
        gutil.log('Running on ios');
        done();
    });
});

gulp.task('ios', ['styles', 'scripts', 'refresh-ios']);
gulp.task('android', ['styles', 'scripts', 'refresh-android']);

// The default task
gulp.task('default', function() {
    // Watch the JS directory for changes and re-run scripts task when it changes
    gulp.watch(webPath('js/**'), ['styles', 'refresh']);

    // Watch the CSS directory for changes and re-run styles task when it changes
    gulp.watch(webPath('sass/**'), ['styles', 'refresh']);

    gulp.watch(webPath(''), { ignore: ['sass', 'js'] }, ['refresh']);

    // Run scripts and styles tasks for the first time
    gulp.run('scripts');
    gulp.run('styles');

    var options = {
        keepAlive: false,
        open: true,
        port: 4400
    };

    // Start the ripple server
    ripple.emulate.start(options);

    if (options.open) {
        o('http://localhost:' + options.port + '?enableripple=cordova-3.0.0-iPhone5');
    }
});