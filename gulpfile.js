/*jslint node: true */

(function () {
    'use strict';

    var merge = require('merge-stream'),
        gulp = require('gulp'),
        less = require('gulp-less'),
        AutoprefixerPlugin = require('less-plugin-autoprefix'),
        autoprefixer = new AutoprefixerPlugin({browsers: ["last 2 versions"]}),
        rename = require('gulp-rename'),
        nano = require('gulp-cssnano');

    gulp.task('default', function () {
        var css,
            cssMin;

        css = gulp.src('./src/vanilla-bs-menu.less')
            .pipe(less({
                plugins: [autoprefixer]
            }))
            .pipe(gulp.dest('./dist/'));

        cssMin = gulp.src('./src/vanilla-bs-menu.less')
            .pipe(less({
                plugins: [autoprefixer]
            }))
            .pipe(nano())
            .pipe(rename({
                extname: '.min.css'
            }))
            .pipe(gulp.dest('./dist/'));

        return merge(css, cssMin);
    });
}());
