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


const html2txt    = require('gulp-html2txt')
const streamqueue = require('streamqueue')

// タスクhtmlとcssは省略。EJSやLESSなどによるプリプロセスなどを想定しています

gulp.task('font', ['html', 'css'], cb => {

  const texts = []

  // 複数のストリームをマージする
  streamqueue(
    { objectMode: true },

    // HTMLからテキストノードを抽出
    gulp.src(['./dist/*.html'])
      .pipe(html2txt()),

    // CSSからcontentプロパティの文字を抽出
    gulp.src(['./dist/*.css'])
      .pipe(css2txt())
  )
    // .pipe(hoge()) // 必要ならポスト処理を追加できます
    .on('data', file => texts.push(file.contents.toString()))
    .on('end', () => {

      const text = texts.join('')
      const formats = ['eot', 'ttf', 'woff', 'svg']

      // あとは良いように処理ができます
      Promise.all([
        new Promise((resolve, reject) => {
          // FontAwesomeをサブセット
          gulp.src('./node_modules/font-awesome/fonts/**/*.ttf')
            .pipe(fontmin({ text, formats }))
            .pipe(gulp.dest('./dist/fonts'))
            .on('end', resolve)
            .on('error', reject)
        }),
        new Promise((resolve, reject) => {
          // 好きなフォントをサブセット
          gulp.src('./path/to/pretty/font.ttf')
            .pipe(fontmin({ text, formats }))
            .pipe(gulp.dest('./dist/fonts'))
            .on('end', resolve)
            .on('error', reject)
        })
      ])
        .then(() => cb())
        .catch(err => process.stderr.write(err))
    })
})
