# モバイルAI画像アプリ

スマホ向けのAI画像生成アプリ風MVPです。現在はOpenAI画像生成APIへは未接続で、生成ボタンを押すとダミー画像カードを表示します。

## 使い方

GitHub Pagesで `index.html` を公開すれば動作します。

## 構成

- `index.html`：画面本体
- `styles.css`：スマホ向けUI
- `app.js`：ダミー生成ロジック
- `manifest.webmanifest`：PWA設定
- `sw.js`：簡易オフライン対応
- `icon.svg`：アプリアイコン
