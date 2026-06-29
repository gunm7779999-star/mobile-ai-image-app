# Mobile AI Image App

スマホで使いやすい **AI画像生成アプリ風Webアプリ** のMVPです。  
現段階ではOpenAI画像生成APIには接続せず、生成ボタンを押すとダミー画像カードを表示します。

## 主な機能

- スマホファーストUI
- 画像説明プロンプト入力
- 画像スタイル選択
- 画像サイズ選択
- 生成枚数選択
- ダミー生成結果表示
- 入力内容の自動保存
- GitHub Pages向け静的出力
- 将来のOpenAI Images API接続を想定した構成

## 技術構成

- Next.js
- TypeScript
- Tailwind CSS
- GitHub Actions / GitHub Pages

## ローカル起動

```bash
npm install
npm run dev
```

ブラウザで以下を開きます。

```text
http://localhost:3000
```

## ビルド

```bash
npm run build
```

静的サイトは `out` フォルダに出力されます。

## GitHubへのアップロード方法

1. GitHubで `mobile-ai-image-app` リポジトリを開きます。
2. `Add file` → `Upload files` を選びます。
3. このフォルダ内のファイルとフォルダをすべてアップロードします。
4. `Commit changes` を押します。

## GitHub Pages公開方法

1. リポジトリの `Settings` を開きます。
2. 左メニューの `Pages` を開きます。
3. `Build and deployment` の `Source` を `GitHub Actions` にします。
4. `main` にpushすると `.github/workflows/pages.yml` が実行されます。
5. 公開URLは通常、以下の形式です。

```text
https://gunm7779999-star.github.io/mobile-ai-image-app/
```

## 今後のAPI接続イメージ

`handleGenerate()` のダミー生成処理を、OpenAI Images APIへのリクエストに置き換える想定です。  
APIキーはクライアントに直接置かず、Next.js API Routeまたはサーバー側処理で扱ってください。
