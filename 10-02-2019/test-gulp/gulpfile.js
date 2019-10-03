const { src, dest } = require(`gulp`);
const htmlCompressor = require(`gulp-htmlmin`);

let compressHTML = () => {
    return src(`uncompressed-html/*.html`)
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`compressed-html/`));
};

exports.compressHTML = compressHTML;
