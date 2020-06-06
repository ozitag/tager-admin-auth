"use strict";
require("dotenv").config();

const fs = require("fs");
const gulp = require("gulp");
const sass = require("gulp-sass");
const htmlmin = require("gulp-htmlmin");
const rename = require("gulp-rename");
const watch = require("gulp-watch");
const babel = require("gulp-babel");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const handlebars = require("gulp-compile-handlebars");
const replace = require('gulp-replace');

sass.compiler = require("node-sass");

gulp.task("sass", () => {
    return gulp
        .src("./src/sass/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(rename("app.css"))
        .pipe(cleanCSS({compatibility: "ie9"}))
        .pipe(gulp.dest("./build"));
});

gulp.task("html", function () {
    const envLogo = process.env.LOGO;
    const basePath = process.env.BASE_PATH || "";

    let logo = null;
    if ('LOGO' in process.env) {
        if (typeof process.env.LOGO === "string" && process.env.LOGO.length > 0 && process.env.LOGO.toLowerCase() !== 'false' && process.env.LOGO.toLowerCase() !== 'null' && process.env.LOGO !== '0') {
            logo = envLogo.startsWith('http:') ? envLogo : basePath + envLogo;
        }
    } else {
        logo = "logo.svg";
    }

    const templateData = {
        title: process.env.PAGE_TITLE || "OZiTAG",
        base_path: basePath,
        logo: logo ? logo : null,
        brand_color: process.env.BRAND_COLOR || "#DD6900",
        language: process.env.LANGUAGE || "EN",
    };

    const options = {
        ignorePartials: true,
        batch: [`src`],
        helpers: {
            times: function (n, block) {
                let accum = "";
                for (let i = 0; i < n; ++i) accum += block.fn(i + 1);
                return accum;
            },
            ifCond: function (v1, v2, options) {
                if (v1 === v2) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },
            concat: function (...args) {
                return `${args.slice(0, -1).join("")}`;
            },
        },
    };

    return gulp
        .src("src/index.hbs")
        .pipe(handlebars(templateData, options))
        .pipe(rename("index.html"))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("build"));
});

gulp.task("scripts", () => {
    return gulp
        .src("src/js/app.js")
        .pipe(
            babel({
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            useBuiltIns: "entry", // alternative mode: "entry"
                            corejs: 3, // default would be 2
                            targets: "> 0.25%, not dead",
                            // set your own target environment here (see Browserslist)
                        },
                    ],
                ],
            })
        )
        .pipe(rename("app.js"))
        .pipe(uglify())
        .pipe(gulp.dest("build"));
});

gulp.task("watch", () => {
    watch("src/*.hbs", gulp.series("html"));
    watch("src/sass/**/*.scss", gulp.series("sass"));
    watch("src/js/**/*.js", gulp.series("scripts"));
});

gulp.task("favicon-move", () => {
    return gulp.src("./assets/favicon/*").pipe(gulp.dest("./build/favicon"));
});

gulp.task('favicon-fix-paths', () => {
    const basePath = process.env.BASE_PATH || "";

    return gulp.src(['./assets/favicon/browserconfig.xml', './assets/favicon/site.webmanifest'])
        .pipe(replace('/favicon', basePath + '/favicon'))
        .pipe(gulp.dest('build/favicon'));
});


gulp.task("logo", () => {
    const files = [];

    if (fs.existsSync("./assets/logo.png")) {
        files.push("./assets/logo.png");
    }

    if (fs.existsSync("./assets/logo.svg")) {
        files.push("./assets/logo.svg");
    }

    return gulp.src(files).pipe(gulp.dest("./build"));
});

gulp.task('favicon', gulp.series('favicon-move', 'favicon-fix-paths'));
gulp.task("build", gulp.parallel("favicon", "logo", "html", "sass", "scripts"));
gulp.task("dev", gulp.parallel("build", "watch"));
gulp.task("default", gulp.parallel("build"));
