const gulp = require("gulp"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer");

gulp.task("default", function() {
  gulp.watch("src/scss/*.scss", gulp.series("styles"));
});

gulp.task("styles", function() {
  return gulp
    .src("src/*.scss")
    .pipe(
      sass({
        outputStyle: "compressed"
      }).on("error", sass.logError)
    )
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"]
      })
    )
    .pipe(gulp.dest("./src"));
});
