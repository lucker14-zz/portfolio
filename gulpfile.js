var path = require('path')
var gulp = require('gulp');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var stripDebug = require('gulp-strip-debug');
var stylus = require('gulp-stylus');
var nib = require('nib');
var connect = require('gulp-connect')
var babel = require('gulp-babel');
var pump = require('pump');
var named = require('vinyl-named');
var webpack = require('webpack-stream');
const i18n = require('gulp-html-i18n');



gulp.task('connect', function() {
  connect.server({
    root: 'build',
    index: 'index.html',
    host: "0.0.0.0",
    port: "7999",
    livereload: true
  });
});

// directories
var paths = {
    js: 'src/scripts/**/*.js',
    jsDest: 'build',
    styles: 'src/styles',
    stylesDest: 'build',
    html: 'src',
    assets: 'src/assets'
}

gulp.task('scripts', function(cb) {
  pump([
    gulp.src([paths.js]),
    named(),
    webpack({
      output: {
        filename: '[name].js'
      }
    }),
    babel({ presets: ['env'] }),
    uglify(),
    gulp.dest(paths.jsDest),
    connect.reload()
  ], cb);
});


//////////////////////////////
// Stylus Tasks
//////////////////////////////
gulp.task('styles', function () {
  gulp.src(paths.styles + '/main.styl')
    .pipe(stylus({
      paths:  ['node_modules'],
      import: ['nib'],
      use: [nib()],
      'include css': true
    }))
    .pipe(concat('main.css'))
    .pipe(gulp.dest(paths.stylesDest))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest(paths.stylesDest))
});


//////////////////////////////
// Copy HTML
//////////////////////////////
gulp.task('html', function () {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('build/'));
});

// gulp.task('build_html', function () {
//   gulp.src('src/**/*.html')
//     .pipe(i18n({
//       langDir: './src/lang',
//       trace: true
//     }))
//     .pipe(gulp.dest('build/'));
// });

//////////////////////////////
// Copy assets
//////////////////////////////
gulp.task('assets', function () {
    gulp.src('src/assets/**/*')
        .pipe(gulp.dest('build/assets'));
});

gulp.task('favicons', function () {
  gulp.src('src/favicon/**/*')
    .pipe(gulp.dest('build/favicon'));
});


//////////////////////////////
// Watch
//////////////////////////////
gulp.task('watch', function () {
  gulp.watch(paths.js, ['scripts']);
  gulp.watch(paths.assets  + '/**/*', ['assets']);
  gulp.watch(paths.html  + '/**/*.html', ['html']);
  gulp.watch(paths.styles + '/**/*.styl', ['styles']);
});


gulp.task('build', ['styles', 'scripts', 'assets', 'favicons']);
gulp.task('live', ['connect', 'styles', 'scripts', 'assets', 'html', 'favicons', 'watch']);