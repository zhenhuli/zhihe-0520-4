const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();
const detect = require('detect-port');
const path = require('path');

const paths = {
  html: 'src/*.html',
  css: 'src/css/*.css',
  js: 'src/js/*.js',
  images: 'src/images/**/*',
  dist: 'dist'
};

function html() {
  return gulp.src(paths.html)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
}

function css() {
  return gulp.src(paths.css)
    .pipe(concat('all.css'))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(path.join(paths.dist, 'css')))
    .pipe(browserSync.stream());
}

function js() {
  return gulp.src(paths.js)
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(path.join(paths.dist, 'js')))
    .pipe(browserSync.stream());
}

function images() {
  return gulp.src(paths.images)
    .pipe(gulp.dest(path.join(paths.dist, 'images')));
}

function watch() {
  gulp.watch(paths.html, html);
  gulp.watch(paths.css, css);
  gulp.watch(paths.js, js);
}

function serve() {
  return detect(3000).then((port) => {
    browserSync.init({
      server: { baseDir: paths.dist },
      port: port,
      open: true,
      notify: false,
      ui: false
    });
    console.log(`\n🔥 木炭烧制模拟器已启动: http://localhost:${port}\n`);
  });
}

const build = gulp.series(gulp.parallel(html, css, js, images));
const dev = gulp.series(build, gulp.parallel(watch, serve));

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.build = build;
exports.watch = watch;
exports.serve = gulp.series(build, serve);
exports.dev = dev;
exports.default = dev;
