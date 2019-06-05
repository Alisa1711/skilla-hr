const del = require(`del`);
const gulp = require(`gulp`);
const sass = require(`gulp-sass`);
const plumber = require(`gulp-plumber`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const server = require(`browser-sync`).create();
const mqpacker = require(`css-mqpacker`);
const minify = require(`gulp-csso`);
const rename = require(`gulp-rename`);
const imagemin = require(`gulp-imagemin`);
const rigger = require(`gulp-rigger`);
const babel = require(`gulp-babel`);
const ghpages = require(`gh-pages`);

gulp.task(`html`, () => {
  return gulp.src(`*.html`).
    pipe(plumber()).
    pipe(rigger()).
    pipe(gulp.dest(`build`)).
    pipe(server.stream());
});

gulp.task(`style`, () => {
  return gulp.src(`scss/style.scss`).
    pipe(plumber()).
    pipe(sass()).
    pipe(postcss([
      autoprefixer({
        browsers: [
          `last 1 version`,
          `last 2 Chrome versions`,
          `last 2 Firefox versions`,
          `last 2 Opera versions`,
          `last 2 Edge versions`
        ]
      }),
      mqpacker({sort: true})
    ])).
    pipe(gulp.dest(`build/css`)).
    pipe(minify()).
    pipe(rename(`style.min.css`)).
    pipe(gulp.dest(`build/css`)).
    pipe(server.stream());
});

gulp.task(`scripts`, () => {
  return gulp.src(`js/main.js`)
    .pipe(plumber())
    .pipe(babel({
      presets: [`@babel/env`]
    }))
    .pipe(gulp.dest(`build/js`));
});

gulp.task(`imagemin`, [`copy`], () => {
  return gulp.src(`build/img/**/*.{jpg,png,gif}`).
    pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ])).
    pipe(gulp.dest(`build/img`));
});

gulp.task(`copy`, [`html`, `scripts`, `style`], () => {
  return gulp.src([
    `fonts/**/*.{woff,woff2}`,
    `img/**/*.*`,
    `js/*.js`,
    `css/**/*.css`,
    `!js/main.js`
  ], {base: `.`}).
    pipe(gulp.dest(`build`));
});

gulp.task(`clean`, () => {
  return del(`build`);
});

gulp.task(`js-watch`, [`scripts`], (done) => {
  server.reload();
  done();
});

gulp.task(`serve`, [`assemble`], () => {
  server.init({
    server: `./build`,
    notify: false,
    open: true,
    port: 3502,
    ui: false
  });

  gulp.watch(`scss/**/*.{scss,sass}`, [`style`]);
  gulp.watch([`*.html`, `blocks/**/*.html`]).on(`change`, (e) => {
    if (e.type !== `deleted`) {
      gulp.start(`html`);
    }
  });
  gulp.watch(`js/**/*.js`, [`js-watch`]);
});

gulp.task(`assemble`, [`clean`], () => {
  gulp.start(`copy`, `style`);
});

gulp.task(`build`, [`assemble`], () => {
  gulp.start(`imagemin`);
});

gulp.task(`deploy`, () => {
  ghpages.publish(`build`);
});
