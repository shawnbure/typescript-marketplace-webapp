import fs from 'fs';
import del from "del";
import gulp from "gulp";
import childProcess from "child_process";
import webpack from 'webpack-stream';

gulp.task('default', function () {
  return gulp
    .src('src/index.ts')
    .pipe(
      webpack({})
    )
    .pipe(gulp.dest('dist/'));
});
