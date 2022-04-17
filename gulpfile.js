const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const pug = require("gulp-pug");
const autoprefixer = require("gulp-autoprefixer");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();

// Sass Task
function sassTask() {
  return src("app/sass/*.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(postcss([cssnano()]))
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(dest("public/css", { sourcemaps: "." }));
}

// TailwindCSS
function tailwindCSS() {
  return src("public/css/tailwind.css")
    .pipe(postcss([cssnano()]))
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(dest("public/css"));
}

// Pug Task
function pugTask() {
  return src("app/views/*.pug").pipe(pug()).pipe(dest("public"));
}

// JavaScript Task
function jsTask() {
  return src("app/js/*.js", { sourcemaps: true })
    .pipe(terser())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(dest("public/js", { sourcemaps: "." }));
}

// Browsersync Tasks
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: "public",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch("public/*.html", browsersyncReload);
  watch(
    [
      "app/sass/**/*.scss",
      "public/css/tailwind.css",
      "app/views/**/*.pug",
      "app/js/**/*.js",
    ],
    series(sassTask, tailwindCSS, pugTask, jsTask, browsersyncReload)
  );
}

// Default Gulp task
exports.default = series(
  sassTask,
  tailwindCSS,
  pugTask,
  jsTask,
  browsersyncServe,
  watchTask
);
