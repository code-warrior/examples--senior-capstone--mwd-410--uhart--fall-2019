const { src, dest, series, watch } = require(`gulp`);
const HTMLPreprocessor = require(`gulp-nunjucks-render`);
const browserSync = require(`browser-sync`);
const reload = browserSync.reload;
const data = require(`gulp-data`);
const fs = require(`fs`);
const del = require(`del`);
const TEMP_FOLDER = `.tmp/`;
const VIEWS_FOLDER = `app/views/`;

let compileHTML = () => {
    HTMLPreprocessor.nunjucks.configure({watch: false});

    return src(`./app/views/*.html`)
        .pipe(data(function () {
            return JSON.parse(fs.readFileSync(`./app/models/data-file.json`));
        }))
        .pipe(data(function () {
            return JSON.parse(fs.readFileSync(`./app/models/links-file.json`));
        }))
        .pipe(data(function () {
            return JSON.parse(fs.readFileSync(`./app/models/sections-file.json`));
        }))
        .pipe(HTMLPreprocessor())
        .pipe(dest(TEMP_FOLDER));
};

let serve = () => {
    browserSync({
        server: {
            baseDir: [
                TEMP_FOLDER,
                VIEWS_FOLDER
            ]
        }
    });

    watch([
        `./app/views/*.html`,
        `./app/views/css/*.css`,
        `./app/controllers/*.*`,
        `./app/controllers/**/**`,
        `./app/models/*.json`
    ],
    compileHTML).on(`change`, reload);
};

async function clean() {
    let fs = require(`fs`),
        i,
        foldersToDelete = [TEMP_FOLDER];

    for (i = 0; i < foldersToDelete.length; i++) {
        try {
            fs.accessSync(foldersToDelete[i], fs.F_OK);
            process.stdout.write(`\n\tThe ` + foldersToDelete[i] +
                ` directory was found and will be deleted.\n`);
            del(foldersToDelete[i]);
        } catch (e) {
            process.stdout.write(`\n\tThe ` + foldersToDelete[i] +
                ` directory was not found.\n`);
        }
    }

    process.stdout.write(`\n`);
}

exports.serve = series(compileHTML, serve);
exports.compileHTML = compileHTML;
exports.clean = clean;
