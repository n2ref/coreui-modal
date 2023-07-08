const gulp       = require('gulp');
const concat     = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify     = require('gulp-uglify');
const minifyHtml = require("gulp-htmlmin");
const html2js    = require('gulp-html2js');
const wrapFile   = require('gulp-wrap-file');
const rename     = require("gulp-rename");


var conf = {
    dist: "./dist",
    js: {
        fileMin: 'coreui-modal.min.js',
        file: 'coreui-modal.js',
        src: [
            'src/js/coreui.modal.js',
            'src/js/coreui.modal.instance.js',
            'src/js/coreui.modal.utils.js',
            'src/js/coreui.modal.templates.js',
            'src/js/coreui.modal.ejs.js',
            'src/js/lang/*.js'
        ]
    },
    js_dependents: {
        dist: './src/js',
        src: [
            'node_modules/ejs/ejs.min.js',
        ],
        rename: {
            'ejs.min' : 'coreui.modal.ejs',
        },
        wrapper: function(content, file) {
            if (file.path.indexOf('ejs.min.js') >= 0) {
                return "(function() {" +
                    "\"use strict\";" +
                    content + ";" +
                    "CoreUI.modal.ejs = ejs;" +
                    "})();"
            }

            console.warn('!!! not found dependent wrapper for file: ' + file.path)
            return '';
        }
    },
    tpl: {
        file: 'coreui.modal.templates.js',
        dist: './src/js',
        variable: 'CoreUI"]["modal"]["tpl',
        src: [
            'src/html/**/*.html',
            'src/html/*.html'
        ]
    }
};



gulp.task('build_js_min', function() {
    return gulp.src(conf.js.src)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat(conf.js.fileMin, {newLine: ";\n"}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(conf.dist));
});

gulp.task('build_js_min_fast', function() {
    return gulp.src(conf.js.src)
        .pipe(sourcemaps.init())
        .pipe(concat(conf.js.fileMin, {newLine: ";\n"}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(conf.dist));
});

gulp.task('build_js', function() {
    return gulp.src(conf.js.src)
        .pipe(concat(conf.js.file, {newLine: ";\n"}))
        .pipe(gulp.dest(conf.dist));
});

gulp.task('build_dependents', function() {

    return gulp.src(conf.js_dependents.src)
        .pipe(wrapFile({
            wrapper: conf.js_dependents.wrapper
        }))
        .pipe(rename(function (path) {
            if (conf.js_dependents.rename.hasOwnProperty(path.basename)) {
                path.basename = conf.js_dependents.rename[path.basename];
            }
        }))
        .pipe(gulp.dest(conf.js_dependents.dist));
});

gulp.task('build_tpl', function() {
    return gulp.src(conf.tpl.src)
        .pipe(minifyHtml({
            collapseWhitespace: false,
            ignoreCustomFragments: [ /<%[^%]+%>/ ]
        }))
        .pipe(html2js(conf.tpl.file, {
            adapter: 'javascript',
            base: 'templates',
            name: conf.tpl.variable,
            rename: function (moduleName) {
                return moduleName.replace('../src/html/', '');
            }
        }))
        .pipe(gulp.dest(conf.tpl.dist));
});

gulp.task('build_watch', function() {
    gulp.watch(conf.js.src, gulp.parallel(['build_js_fast']));
});

gulp.task("default", gulp.series([ 'build_tpl', 'build_js_min', 'build_js' ]));