'use strict';

/* РїСѓС‚Рё Рє РёСЃС…РѕРґРЅС‹Рј С„Р°Р№Р»Р°Рј (src), Рє РіРѕС‚РѕРІС‹Рј С„Р°Р№Р»Р°Рј (build), Р° С‚Р°РєР¶Рµ Рє С‚РµРј, Р·Р° РёР·РјРµРЅРµРЅРёСЏРјРё РєРѕС‚РѕСЂС‹С… РЅСѓР¶РЅРѕ РЅР°Р±Р»СЋРґР°С‚СЊ (watch) */
var path = {
    build: {
        html: 'assets/build/',
        js: 'assets/build/js/',
        css: 'assets/build/css/',
        img: 'assets/build/img/',
        fonts: 'assets/build/fonts/'
    },
    src: {
        html: 'assets/src/*.html',
        js: 'assets/src/js/main.js',
        style: 'assets/src/style/main.scss',
        img: 'assets/src/img/**/*.*',
        fonts: 'assets/src/fonts/**/*.*'
    },
    watch: {
        html: 'assets/src/**/*.html',
        js: 'assets/src/js/**/*.js',
        css: 'assets/src/style/**/*.scss',
        img: 'assets/src/img/**/*.*',
        fonts: 'assets/srs/fonts/**/*.*'
    },
    clean: './assets/build/*'
};

/* РЅР°СЃС‚СЂРѕР№РєРё СЃРµСЂРІРµСЂР° */
var config = {
    server: {
        baseDir: './assets/build'
    },
    notify: false
};

/* РїРѕРґРєР»СЋС‡Р°РµРј gulp Рё РїР»Р°РіРёРЅС‹ */
var gulp = require('gulp'), // РїРѕРґРєР»СЋС‡Р°РµРј Gulp
    webserver = require('browser-sync'), // СЃРµСЂРІРµСЂ РґР»СЏ СЂР°Р±РѕС‚С‹ Рё Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРѕРіРѕ РѕР±РЅРѕРІР»РµРЅРёСЏ СЃС‚СЂР°РЅРёС†
    plumber = require('gulp-plumber'), // РјРѕРґСѓР»СЊ РґР»СЏ РѕС‚СЃР»РµР¶РёРІР°РЅРёСЏ РѕС€РёР±РѕРє
    rigger = require('gulp-rigger'), // РјРѕРґСѓР»СЊ РґР»СЏ РёРјРїРѕСЂС‚Р° СЃРѕРґРµСЂР¶РёРјРѕРіРѕ РѕРґРЅРѕРіРѕ С„Р°Р№Р»Р° РІ РґСЂСѓРіРѕР№
    sourcemaps = require('gulp-sourcemaps'), // РјРѕРґСѓР»СЊ РґР»СЏ РіРµРЅРµСЂР°С†РёРё РєР°СЂС‚С‹ РёСЃС…РѕРґРЅС‹С… С„Р°Р№Р»РѕРІ
    sass = require('gulp-sass'), // РјРѕРґСѓР»СЊ РґР»СЏ РєРѕРјРїРёР»СЏС†РёРё SASS (SCSS) РІ CSS
    autoprefixer = require('gulp-autoprefixer'), // РјРѕРґСѓР»СЊ РґР»СЏ Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРѕР№ СѓСЃС‚Р°РЅРѕРІРєРё Р°РІС‚РѕРїСЂРµС„РёРєСЃРѕРІ
    cleanCSS = require('gulp-clean-css'), // РїР»Р°РіРёРЅ РґР»СЏ РјРёРЅРёРјРёР·Р°С†РёРё CSS
    uglify = require('gulp-uglify-es').default, // РјРѕРґСѓР»СЊ РґР»СЏ РјРёРЅРёРјРёР·Р°С†РёРё JavaScript
    cache = require('gulp-cache'), // РјРѕРґСѓР»СЊ РґР»СЏ РєСЌС€РёСЂРѕРІР°РЅРёСЏ
    imagemin = require('gulp-imagemin'), // РїР»Р°РіРёРЅ РґР»СЏ СЃР¶Р°С‚РёСЏ PNG, JPEG, GIF Рё SVG РёР·РѕР±СЂР°Р¶РµРЅРёР№
    jpegrecompress = require('imagemin-jpeg-recompress'), // РїР»Р°РіРёРЅ РґР»СЏ СЃР¶Р°С‚РёСЏ jpeg	
    pngquant = require('imagemin-pngquant'), // РїР»Р°РіРёРЅ РґР»СЏ СЃР¶Р°С‚РёСЏ png
    rimraf = require('gulp-rimraf'), // РїР»Р°РіРёРЅ РґР»СЏ СѓРґР°Р»РµРЅРёСЏ С„Р°Р№Р»РѕРІ Рё РєР°С‚Р°Р»РѕРіРѕРІ
    fileinclude = require('gulp-file-include'),
    rename = require('gulp-rename');

/* Р·Р°РґР°С‡Рё */












// Р·Р°РїСѓСЃРє СЃРµСЂРІРµСЂР°
gulp.task('webserver', function() {
    webserver(config);
});

// СЃР±РѕСЂ html
gulp.task('html:build', function() {
    return gulp.src(path.src.html) // РІС‹Р±РѕСЂ РІСЃРµС… html С„Р°Р№Р»РѕРІ РїРѕ СѓРєР°Р·Р°РЅРЅРѕРјСѓ РїСѓС‚Рё
        .pipe(plumber()) // РѕС‚СЃР»РµР¶РёРІР°РЅРёРµ РѕС€РёР±РѕРє
        .pipe(rigger()) // РёРјРїРѕСЂС‚ РІР»РѕР¶РµРЅРёР№
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.build.html)) // РІС‹РєР»Р°РґС‹РІР°РЅРёРµ РіРѕС‚РѕРІС‹С… С„Р°Р№Р»РѕРІ
        .pipe(webserver.reload({ stream: true })); // РїРµСЂРµР·Р°РіСЂСѓР·РєР° СЃРµСЂРІРµСЂР°
});


// СЃР±РѕСЂ СЃС‚РёР»РµР№
gulp.task('css:build', function() {
    return gulp.src(path.src.style) // РїРѕР»СѓС‡РёРј main.scss
        .pipe(plumber()) // РґР»СЏ РѕС‚СЃР»РµР¶РёРІР°РЅРёСЏ РѕС€РёР±РѕРє
        .pipe(sourcemaps.init()) // РёРЅРёС†РёР°Р»РёР·РёСЂСѓРµРј sourcemap
        .pipe(sass()) // scss -> css
        .pipe(autoprefixer()) // РґРѕР±Р°РІРёРј РїСЂРµС„РёРєСЃС‹
        .pipe(gulp.dest(path.build.css))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS()) // РјРёРЅРёРјРёР·РёСЂСѓРµРј CSS
        .pipe(sourcemaps.write('./')) // Р·Р°РїРёСЃС‹РІР°РµРј sourcemap
        .pipe(gulp.dest(path.build.css)) // РІС‹РіСЂСѓР¶Р°РµРј РІ build
        .pipe(webserver.reload({ stream: true })); // РїРµСЂРµР·Р°РіСЂСѓР·РёРј СЃРµСЂРІРµСЂ
});

// СЃР±РѕСЂ js
gulp.task('js:build', function() {
    return gulp.src(path.src.js) // РїРѕР»СѓС‡РёРј С„Р°Р№Р» main.js
        .pipe(plumber()) // РґР»СЏ РѕС‚СЃР»РµР¶РёРІР°РЅРёСЏ РѕС€РёР±РѕРє
        .pipe(rigger()) // РёРјРїРѕСЂС‚РёСЂСѓРµРј РІСЃРµ СѓРєР°Р·Р°РЅРЅС‹Рµ С„Р°Р№Р»С‹ РІ main.js
        .pipe(gulp.dest(path.build.js))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.init()) //РёРЅРёС†РёР°Р»РёР·РёСЂСѓРµРј sourcemap
        .pipe(uglify()) // РјРёРЅРёРјРёР·РёСЂСѓРµРј js
        .pipe(sourcemaps.write('./')) //  Р·Р°РїРёСЃС‹РІР°РµРј sourcemap
        .pipe(gulp.dest(path.build.js)) // РїРѕР»РѕР¶РёРј РіРѕС‚РѕРІС‹Р№ С„Р°Р№Р»
        .pipe(webserver.reload({ stream: true })); // РїРµСЂРµР·Р°РіСЂСѓР·РёРј СЃРµСЂРІРµСЂ
});

// РїРµСЂРµРЅРѕСЃ С€СЂРёС„С‚РѕРІ
gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

// РѕР±СЂР°Р±РѕС‚РєР° РєР°СЂС‚РёРЅРѕРє
gulp.task('image:build', function() {
    return gulp.src(path.src.img) // РїСѓС‚СЊ СЃ РёСЃС…РѕРґРЅРёРєР°РјРё РєР°СЂС‚РёРЅРѕРє
        .pipe(cache(imagemin([ // СЃР¶Р°С‚РёРµ РёР·РѕР±СЂР°Р¶РµРЅРёР№
            imagemin.gifsicle({ interlaced: true }),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            pngquant(),
            imagemin.svgo({ plugins: [{ removeViewBox: false }] })
        ])))
        .pipe(gulp.dest(path.build.img)); // РІС‹РіСЂСѓР·РєР° РіРѕС‚РѕРІС‹С… С„Р°Р№Р»РѕРІ
});

// СѓРґР°Р»РµРЅРёРµ РєР°С‚Р°Р»РѕРіР° build 
gulp.task('clean:build', function() {
    return gulp.src(path.clean, { read: false })
        .pipe(rimraf());
});

// РѕС‡РёСЃС‚РєР° РєСЌС€Р°
gulp.task('cache:clear', function() {
    cache.clearAll();
});

// СЃР±РѕСЂРєР°
gulp.task('build',
    gulp.series('clean:build',
        gulp.parallel(
            'html:build',
            'css:build',
            'js:build',
            'fonts:build',
            'image:build'
        )
    )
);

// Р·Р°РїСѓСЃРє Р·Р°РґР°С‡ РїСЂРё РёР·РјРµРЅРµРЅРёРё С„Р°Р№Р»РѕРІ
gulp.task('watch', function() {
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.css, gulp.series('css:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
});

// Р·Р°РґР°С‡Р° РїРѕ СѓРјРѕР»С‡Р°РЅРёСЋ
gulp.task('default', gulp.series(
    'build',
    gulp.parallel('webserver', 'watch')
));