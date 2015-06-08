var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var server = require('gulp-server-livereload');
var sass = require('gulp-sass');
var rev = require('gulp-rev');
var sourcemaps = require('gulp-sourcemaps');
var mainBowerFiles = require('main-bower-files');
var del = require('del');
var fs = require('fs');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');

var paths = {
    scss: "src/assets/scss/**/*.scss",
    scripts: "src/assets/js/**/*.js",
    static: ["src/assets/img/**/*", "src/assets/partners/**/*"],
};

var handlebarOpts = {
    helpers: {
        assetPath: function (path, context) {
            if(context.data['root'] && context.data.root[path]) {
                path = context.data.root[path];
            }

            return ['/assets', path].join('/');
        }
    }
};

gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del(['./dist'], cb);
});

gulp.task('bower', function() {
    return gulp.src(mainBowerFiles())
    .pipe(uglify())
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('./temp/assets/js'));
});

gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('app.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./temp/assets/js'));
});

gulp.task('scss', function() {
    return gulp.src(paths.scss)
    .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('style.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('temp/assets/css'));
});

gulp.task('static', function() {
    return gulp.src(paths.static, {base: "src"})
    .pipe(gulp.dest('temp/'))
});

gulp.task('assets', ['static', 'scss', 'scripts']);
gulp.task('dist', ['fingerprint', 'bower', 'index fingerprint']);

gulp.task('fingerprint', ['assets'], function () {
    // by default, gulp would pick `assets/css` as the base,
    // so we need to set it explicitly:
    return gulp.src(['temp/assets/**/**/*'], {base: 'temp/assets'})
        .pipe(gulp.dest('dist/assets'))  // write rev'd assets to build dir
        .pipe(rev())
        .pipe(gulp.dest('dist/assets'))  // write rev'd assets to build dir
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/')); // write manifest to build dir
});

gulp.task('index fingerprint', ['fingerprint'], function() {
    // read in our manifest file
    var manifest = JSON.parse(fs.readFileSync('./dist/rev-manifest.json', 'utf8'));

    // read in our handlebars template, compile it using
    // our manifest, and output it to index.html
    return gulp.src('src/index.hbs')
        .pipe(handlebars(manifest, handlebarOpts))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('dist/'));

});

gulp.task('index', function () {
    // read in our handlebars template, compile it using
    // our manifest, and output it to index.html
    return gulp.src('src/index.hbs')
        .pipe(handlebars({}, handlebarOpts))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('temp/'));
});


gulp.task('watch', function() {
  gulp.watch('src/index.hbs', ['index']);
  gulp.watch('src/**/*', ['assets']);
});


gulp.task('webserver', ['index'], function() {
  gulp.src('./temp/')
    .pipe(server({
      livereload: true,
      defaultFile: 'index.html',
      directoryListing: false,
      open: true
    }));
});

gulp.task('default', ['webserver', 'watch', 'assets', 'bower', 'index']);
