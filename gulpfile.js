'use strict';

let gulp = require('gulp');
let gulp_htmlmin = require('gulp-htmlmin');
let gulp_concat = require('gulp-concat');
let gulp_sequence = require('gulp-sequence');
let sourcemaps = require('gulp-sourcemaps');
let gulp_uglify = require('gulp-uglify');
let rollup = require('rollup').rollup;

////////
gulp.task('default', ['build']);
gulp.task('build', gulp_sequence(['rollup', 'css', 'html'], 'docs'));
gulp.task('ugly', ['set_ugly', 'build']);

////////
var gulp_base = require('./gulp-include/gulp_base.js');
var task_config = require('./gulp-include/task_config.json');
var is_ugly = false;

//////
gulp.task('css', function () {
    return gulp.src(task_config.css.src_array)
        .pipe(sourcemaps.init())
        .pipe(gulp_concat(task_config.css.bundle_file))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(task_config.build.css));
});

gulp.task('docs', function () {
    gulp.src([task_config.build.root + '/*'])
        .pipe(gulp.dest(task_config.docs.root));

    gulp.src([task_config.build.js + '/*'])
        .pipe(gulp.dest(task_config.docs.js));

    gulp.src([task_config.build.css + '/*'])
        .pipe(gulp.dest(task_config.docs.css));
});

gulp.task('html', function () {
    return gulp.src(task_config.html.src_array)
        .pipe(gulp_htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(task_config.build.root));
});

gulp.task('rollup', function () {
    let rollup_option = _get_rollup_option();
    let bundle_option = _get_rollup_bundle_option();

    return rollup(rollup_option).then(function (bundle) {
        return bundle.write(bundle_option);
    });
});

gulp.task('set_ugly', function () {
    is_ugly = true;
});


//// rollup util
var npm_pkg = require('./package.json');
var rollup_config = require('./gulp-include/rollup_config.json');

function _get_rollup_option() {
    let npm_dependencies = Object.keys(npm_pkg.dependencies);
    let plugin_array = gulp_base.get_plugin_array(is_ugly);

    let rollup_option = Object.assign(
        rollup_config.rollup_option, {
            external: npm_dependencies,
            plugins: plugin_array
        }
    );

    return rollup_option;
}

function _get_rollup_bundle_option() {
    let bundle_obj = (is_ugly) ? (rollup_config.bundle_production) : (rollup_config.bundle_dev);
    let bundle_option = Object.assign(
        bundle_obj, {
            dest: task_config.build.bundle_file
        }
    );

    return bundle_option;
}
