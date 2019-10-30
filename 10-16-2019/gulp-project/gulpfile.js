const { src, dest, watch, series } = require(`gulp`);
const htmlValidator = require(`gulp-html`);
const htmlCompressor = require(`gulp-htmlmin`);
const browserSync = require(`browser-sync`);
const reload = browserSync.reload;

let validateHTML = () => {
    return src(`html/*.html`)
        .pipe(htmlValidator());
};

let compressHTML = () => {
    return src(`html/*.html`)
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod/`));
};

let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 0, // A delay is sometimes helpful when reloading at the
        server: {       // end of a series of tasks.
            baseDir: [
                `temp`,
                `html`
            ]
        }
    });

    watch(`html/**/*.html`, series(validateHTML)).on(`change`, reload);
};

exports.validateHTML = validateHTML;
exports.compressHTML = compressHTML;
exports.build = series(validateHTML, compressHTML);
exports.serve = series(validateHTML, serve);
