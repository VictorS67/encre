const gulp = require("gulp");
const babel = require("gulp-babel");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");

gulp.task("clean", async function () {
  await del("lib/**");
  await del("es/**");
  await del("dist/**");
});

gulp.task("cjs", function () {
  return gulp
    .src(["./es/**/*.js"])
    .pipe(
      babel({
        configFile: "./.babelrc",
      })
    )
    .pipe(gulp.dest("lib/"));
});

gulp.task("es", function () {
  const tsProject = ts.createProject("tsconfig.pro.json", {
    module: "ESNext",
  });
  return tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(babel())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("es/"));
});

gulp.task("declaration", function () {
  const tsProject = ts.createProject("tsconfig.pro.json", {
    declaration: true,
    emitDeclarationOnly: true,
  });
  return tsProject
    .src()
    .pipe(tsProject())
    .pipe(gulp.dest("es/"))
    .pipe(gulp.dest("lib/"));
});

exports.default = gulp.series("clean", "es", "cjs", "declaration");
