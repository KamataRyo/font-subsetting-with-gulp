const gulp    = require('gulp')
const css2txt = require('gulp-css2txt')
const fontmin = require('gulp-fontmin')

gulp.task('subset', cb => {

  const texts = []
  // まずcontentプロパティの値を集める
  gulp.src(['./style.css'])
    .pipe(css2txt())
    .on('data', file => texts.push(file.contents.toString()))
    .on('end', () => {
      // cssからの文字の抽出が終わったら、これをフォントファイルに適用する
      gulp.src(['./node_modules/font-awesome/fonts/fontawesome-webfont.ttf'])
        .pipe(fontmin({
          text: texts.join(''),
          formats: ['eot', 'ttf', 'woff', 'svg']
        }))
        .pipe(gulp.dest('./fonts'))
        .on('end', () => cb())
    })
})
