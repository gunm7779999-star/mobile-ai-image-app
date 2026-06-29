# mobile-ai-image-app

スマホファーストの静的フロントエンドと、Vercel Serverless Functionで構成したOpenAI画像生成アプリです。

## 構成

```text
index.html              画面
styles.css              スマホ向けスタイル
app.js                  UIと /api/generate 呼び出し
api/generate.js         Vercel Serverless Function
sw.js                   静的ファイルのオフラインキャッシュ
manifest.webmanifest    PWA設定
icon.svg                アプリアイコン
.env.example            環境変数の例（秘密情報なし）
```

ビルド処理やフレームワークは不要です。APIキーはブラウザへ渡さず、Vercel Functionだけが参照します。

## Vercelへデプロイ

1. このリポジトリをVercelへImportします。
2. Framework Presetは **Other** のままにします。
3. Build CommandとOutput Directoryは空欄にします。
4. Environment Variablesへ `OPENAI_API_KEY` を追加します。
5. 必要なら `OPENAI_IMAGE_MODEL` も追加します。未設定時は `gpt-image-1-mini` を使用します。
6. Deployを実行します。

環境変数を追加・変更した後は、VercelでRedeployしてください。本物のAPIキーを `.env` やソースコードへコミットしないでください。

## 環境変数

| 名前 | 必須 | 内容 |
| --- | --- | --- |
| `OPENAI_API_KEY` | 必須 | OpenAI APIキー。Vercelのサーバー側だけで使用 |
| `OPENAI_IMAGE_MODEL` | 任意 | 画像モデル。既定値は `gpt-image-1-mini` |

## ローカル確認

Vercel CLIをインストールし、プロジェクトフォルダで実行します。

```bash
npm install -g vercel
vercel dev
```

初回はVercelの案内に従ってログイン・プロジェクト連携を行い、表示されたローカルURLを開きます。APIを使わず画面だけ確認する場合は、任意の静的HTTPサーバーでも表示できます。

```bash
python -m http.server 8000
```

静的HTTPサーバーでは `/api/generate` が存在しないため、画像生成は実行できません。

## API仕様

フロントエンドは `/api/generate` へ次のJSONをPOSTします。

```json
{
  "prompt": "作りたい画像の説明",
  "style": "写真",
  "size": "1024x1024",
  "count": 1
}
```

Functionは入力を検証し、サーバー側の `OPENAI_API_KEY` でOpenAI Images APIを呼び出します。枚数は1・2・4、サイズは正方形・縦長・横長に制限しています。

## セキュリティ上の注意

- APIキーをHTMLやJavaScriptへ直接書かない
- `OPENAI_API_KEY` はVercelのEnvironment Variablesへ設定する
- `.env` と `.vercel` は `.gitignore` で除外済み
- 公開アプリでは利用量・レート制限・認証の追加も検討する

## OpenAI公式資料

- [Image generation guide](https://platform.openai.com/docs/guides/image-generation)
- [Images API reference](https://platform.openai.com/docs/api-reference/images/create)
