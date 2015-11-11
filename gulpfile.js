var gulp 	= require('gulp'),
    // rjs  = require('requirejs'),
    // useref   = require('gulp-useref'),
    // RevAll   = require('gulp-rev-all'),
	clean 	=  require('gulp-clean'),
    connect = require('gulp-connect')
    gulpSequence = require('gulp-sequence'); //顺序执行task

gulp.task('clean', function () {
    return gulp.src('release/')
        .pipe(clean({force: true}))
        .pipe(clean());
});

//test
gulp.task('copy',['clean'],function(){
	return gulp.src('app/**/*')
	    .pipe( gulp.dest('release/'));
})

//开启服务
gulp.task('connect', function() {
    connect.server({
        port: 8090,
        livereload: true
    });
});

//重载文件
gulp.task('reload', function () {
    gulp.src(['./**/*','!./gulpfile.js','!./package.json'])
        .pipe(connect.reload());
});

// 监听
gulp.task('watch', function() {
    gulp.watch(['./**/*','!./gulpfile.js','!./package.json'], ['reload']);
});


gulp.task('default', gulpSequence('connect','watch'));
