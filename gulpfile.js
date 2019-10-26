const { series, parallel, src, dest, watch } = require('gulp');
const sass 						= require('gulp-sass'),
			browserSync 		= require('browser-sync').create(),
			autoprefixer 		= require('gulp-autoprefixer'),
			notify 					= require('gulp-notify'),
			del 						= require('del'),
			concat 					= require('gulp-concat'),
			imageMin 				= require('gulp-imagemin'),
			cache 					= require('gulp-cache');

function jsTranspile () {
	return src('app/js/**/*.js')
	.pipe(concat('scripts.js'))
	.pipe(dest('app'))
	.pipe(browserSync.stream())
}

function cssTranspile () {
	return src('app/scss/*.scss')
	.pipe(sass({outputStyle: 'expanded'}).on("error", notify.onError()))
	.pipe(autoprefixer(['last 10 versions']))
	.pipe(dest('app'))
	.pipe(browserSync.stream())
}

function serve () {
	browserSync.init({
		server: "./app"
	});

	watch('./app/scss/**/*.scss', cssTranspile);
	watch('./app/js/**/*.js', jsTranspile);
	watch('./app/index.html').on('change', browserSync.reload);
}

//build
function buildHtml () {
	return src([
		'app/index.html',
	]).pipe(dest('dist'));
}

function buildCss () {
	return src([
		'app/main.css',
	]).pipe(dest('dist'));
}

function buildJs () {
	return src([
		'app/scripts.js',
	]).pipe(dest('dist'));
}

function buildFonts () {
	return src([
		'app/assets/fonts/**/*',
	]).pipe(dest('dist/assets/fonts'));
}

function minImages () {
	return src('app/assets/images/**/*')
	.pipe(cache(imageMin()))
	.pipe(dest('dist/assets/images')); 
}

function removeDist () {
	return del('dist');
}

exports.default = series( cssTranspile, jsTranspile, serve );
exports.build = series( removeDist, parallel( cssTranspile, jsTranspile ), parallel( buildHtml, buildCss, buildJs, buildFonts, minImages ));