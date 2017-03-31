# Gulpを使ってFontAwesomeのサブセットフォントを作成する

Gulpを使ってFontAwesomeのフォントのサブセットを作成し、フォントファイルのサイズを縮小します。

## インストール

プロジェクトをnpmで初期化し、`FontAwesome`、`Gulp`及び必要なGulpプラグインをプロジェクトにインストールします。

```shell
$ npm init
$ npm install -S font-awesome
$ npm install -D gulp gulp-css2txt gulp-fontmin
```

`gulp-css2txt`はフォントのサブセットを行うために作成したプラグインです。
CSSに含まれるcontentプロパティを抽出し、ブラウザに表示されることになる文字を特定します。

`gulp-fontmin`はフォントのサブセット化を行うためのGulpプラグインです。

## HTML及びCSS

このポストで扱う適当なHTMLファイルとCSSファイルです。

index.html

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <link rel="stylesheet" href="./style.css">
  <title>Document</title>
</head>
<body>
  <p class="with-icons">この前後にアイコンが表示されます</p>
</body>
</html>
```

style.css

```css
@font-face {
  font-family: 'FontAwesome';
  src: url('./fonts/fontawesome-webfont.eot');
  src:
    url('./fonts/fontawesome-webfont.eot?#iefix') format('embedded-opentype'),
    url('./fonts/fontawesome-webfont.woff') format('woff'),
    url('./fonts/fontawesome-webfont.ttf') format('truetype'),
    url('./fonts/fontawesome-webfont.svg') format('svg');
}

/* example */
.with-icons::before {
  content: '\f000';
  font-family: 'FontAwesome';
}
.with-icons::after {
  content: '\f001';
  font-family: 'FontAwesome';
}
```

ブラウザで表示すると次のように表示されるはずです。アイコンはまだ表示されません。

![no icons](./images/01_noicons.png)

## gulpfile.jsの作成

`gulpfile.js`を作成し、フォントをサブセットするタスクを定義します。
サブセット化したファイルは、 `./fonts`以下に置くことにします。

```javascript
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
```

## ビルドの実行

ビルドを実行します。実際には、 `$ npm run build`などのエイリアスとするのが良いでしょう。

```shell
$ $(npm bin)/gulp subset

> project@1.0.0 build /path/to/project
> gulp subset

[00:00:00] Using gulpfile /path/to/project/gulpfile.js
[00:00:00] Starting 'subset'...
[00:00:00] gulp-fontmin: Minified 1 font
[00:00:00] Finished 'subset' after 125 ms
```

`./fonts`以下にフォントファイルが配置されてパスが通りました。

ブラウザでhtmlファイルを読み込むと、以下のように表示されているはずです。

![with icons](./images/02_withicons.png)

ファイルサイズも確かに小さくなっています。

縮小前
![before](./images/03_sizebefore.png)

縮小後
![after](./images/04_sizeafter.png)

## ライセンスについて

FontAwesomeのフォントは、OFL 1.1というライセンスで提供されているようです。
カスタマイズしてプロジェクトに同梱する場合は、CSSなどにライセンスを表示する必要があるでしょう。

## リポジトリ

Gulpでフォントファイルを縮小する例としてGitHubにリポジトリを作成しています。
