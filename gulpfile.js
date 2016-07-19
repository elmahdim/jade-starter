var gulp         = require('gulp');
var jade         = require('gulp-jade');
var del          = require('del');
var sass         = require('gulp-sass');
var concat       = require('gulp-concat');
var browserSync  = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var nodemon      = require('gulp-nodemon');
var eslint       = require('gulp-eslint');
var uglify       = require('gulp-uglify');
var argv         = require('yargs').argv;
var reload       = browserSync.reload;

var defaults = {
    themes : {
        root : 'src/sass/bootstrap-sass/',
        src  : 'src/sass/bootstrap-sass/assets/stylesheets/**/*',
        dest : 'src/sass/themes/'
    },
    jade : {
        options : {
            pretty: true
        },
        src : 'src/views/**/!(_)*.jade',
        dest : 'build/'
    },
    js: {
        src : ['src/js/*.js', 'src/js/**/*.js'],
        dest: 'public/assets/scripts',
        output : 'main.js'
    },
    uglify : {
      src : 'public/assets/scripts/**/*.js',
      dest : 'build/assets/scripts/',
      output : 'main.min.js'
    },
    sass : {
        options : {
            outputStyle: 'compressed'
        },
        src : ['src/sass/**/*.scss', 'src/sass/themes/**/*.scss', 'src/sass/main.scss'],
        dest: 'public/assets/styles',
        build : 'build/assets/styles',
        output: 'main.css'
    },
    prefixer: {
        browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    }
};

// Copy bootstrap-sass to a new theme directory
// ============================================
gulp.task('theme', function () {
    return gulp.src(defaults.themes.src)
        .pipe(gulp.dest(defaults.themes.dest + argv.name));
});

// Delete installed npm, bower packages
// ====================================
gulp.task("clean:pkg", function () {
    return del([defaults.themes.root, 'node_modules']);
});

// Start the server and watch any changes
// ======================================
gulp.task('serve', ['nodemon'], function() {
    browserSync.init(null, {
        injectChanges: true,
        files: ["public/**/*.*"],
        proxy: '127.0.0.1:5000',
        notify: true
    });

    gulp.watch(defaults.sass.src, ['sass']);
    gulp.watch(defaults.js.src, ['js']);
    gulp.watch(["src/views/*.jade", "src/views/**/*.jade"]).on('change', reload);
});

// Automatically restart the server on any changes
// ===============================================
gulp.task('nodemon', function (cb) {
    var started = false;
    return nodemon({
        script: 'server.js'
    }).on('start', function () {
        if (!started) {
            started = true;
            cb();
        }
    });
});

// Compile Jade templates to HTML
// ==============================
gulp.task('templates', function() {
    return gulp.src(defaults.jade.src)
        .pipe(jade(defaults.jade.options))
        .pipe(gulp.dest(defaults.jade.dest))
});

// Compile Sass files
// ==================
gulp.task('sass', function () {
    return gulp.src(defaults.sass.src)
        .pipe(sass())
        .pipe(autoprefixer(defaults.prefixer))
        .pipe(gulp.dest(defaults.sass.dest))
        .pipe(browserSync.stream());
});
gulp.task('css', function () {
    return gulp.src(defaults.sass.src)
        .pipe(sass(defaults.sass.options))
        .pipe(autoprefixer(defaults.prefixer))
        .pipe(gulp.dest(defaults.sass.build));
});

// Concat all JavaScript files
// ===========================
gulp.task('js', function () {
    return gulp.src(defaults.js.src)
        .pipe(concat(defaults.js.output))
        .pipe(gulp.dest(defaults.js.dest))
        .pipe(browserSync.stream());
});

// Minify JavaScript files
// =======================
gulp.task('uglify', function () {
    return  gulp.src(defaults.uglify.src)
    .pipe(concat(defaults.uglify.output))
    .pipe(uglify())
    .pipe(gulp.dest(defaults.uglify.dest))
});

// Build
// =====
gulp.task('build', ['css', 'uglify', 'templates']);

// Clean build
// ===========
gulp.task("clean:build", function () {
    return del('build');
});

gulp.task('default', ['sass', 'js', 'serve']);