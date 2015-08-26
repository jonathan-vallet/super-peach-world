var gulp            = require('gulp');
var del             = require('del');
var notify          = require('gulp-notify');
var plumber         = require('gulp-plumber');
var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var watch			= require('gulp-watch');
var runSequence     = require('run-sequence');
var source          = require('vinyl-source-stream');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglifyjs');

var config = { path: { 
    build:          './www/',
    buildAssets:    './www/assets/',
    styles:         ['./src/assets/scss/**/*.scss'],
    images:         ['./src/assets/img/**/*'],
    fonts:          ['./src/assets/fonts/**/*'],
    js:             ['./src/assets/js/*'],
    views:          ['./src/**/*.html']
}};

gulp.task('fonts', function() {
    return gulp
        .src(config.path.fonts)
        .pipe(gulp.dest(config.path.buildAssets + 'fonts'));
});

gulp.task('js', function() {
    return gulp
        .src(config.path.js)
        //.pipe(uglify())
        .pipe(gulp.dest(config.path.buildAssets + 'js'));
});

gulp.task('images', function() {
    return gulp
        .src(config.path.images)
        .pipe(gulp.dest(config.path.buildAssets + 'img'));
});

gulp.task('views', function() {
    return gulp
        .src(config.path.views)
        .pipe(gulp.dest(config.path.build));
});

// TODO : optimize css with gulp-cssmin and gulp-uncss
// TODO : configure autoprefixer only for the targeted browsers
gulp.task('styles', function() {
    return gulp
        .src(config.path.styles)
        .pipe(plumber({errorHandler: notify.onError({
            message: "<%= error.message %>",
            title: "SASS Error"
        })}))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(minifyCss())
        .pipe(gulp.dest(config.path.buildAssets+'css'))
        .on('error', function() {
            this.emit("error", new Error("SASS Error"));
        });
});

gulp.task('clean', function(cb) {
    del(config.path.build, cb);
});

gulp.task('build', ['clean'], function() {
    gulp
        .src('config.xml')
        .pipe(gulp.dest(config.path.build));

    gulp
        .src('./src/cordovaInit.js')
        .pipe(gulp.dest(config.path.build));

  return runSequence(['styles', 'views', 'images', 'fonts', 'js']);
});

gulp.task('watch', ['build'],  function() {
	gulp.src(config.path.styles)
	  .pipe(watch(config.path.styles, function() {
	    gulp.start('styles');
	}));
	gulp.src(config.path.images)
	  .pipe(watch(config.path.images, function() {
	    gulp.start('images');
	}));
	gulp.src(config.path.views)
	  .pipe(watch(config.path.views, function() {
	    gulp.start('views');
	}));

	gulp.watch(config.path.scripts, ['scripts']);
    gulp.watch(config.path.views,   ['views']);
    gulp.watch(config.path.fonts,   ['fonts']);
    gulp.watch(config.path.js,   ['js']);
});

gulp.task('default', ['build']);
