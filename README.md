# MovieLogs

観た映画を検索して、鑑賞日・評価・感想を記録できる映画鑑賞記録アプリです。
Next.js (App Router) と Prisma / PostgreSQL で構築した個人開発のポートフォリオです。

開発開始: 2026/08/03

## 概要

- 外部の映画データベース [TMDB](https://www.themoviedb.org/) の API で作品を検索し、詳細を確認できます
- 作品ごとに鑑賞日・評価(1〜10)・感想を登録し、マイページで一覧・編集・削除できます
- ユーザ登録・ログイン機能があり、記録はユーザごとに管理されます
- ライト / ダークテーマの切り替えに対応しています

## 主な機能

| 機能 | 内容 |
| --- | --- |
| ユーザ登録 / ログイン / ログアウト | メールアドレス + パスワード認証(bcrypt でハッシュ化) |
| 映画検索 | TMDB 検索 API(日本語、ページング対応) |
| 映画詳細 | TMDB 詳細 API から作品情報を表示 |
| 鑑賞記録の登録 / 編集 / 削除 | 鑑賞日・評価・感想を記録(削除は論理削除) |
| マイページ | 自分の鑑賞記録の一覧表示 |
| テーマ切り替え | ライト / ダークを `localStorage` に保存 |

## 使用技術

| 分類 | 技術 |
| --- | --- |
| フレームワーク | Next.js 16 (App Router, Server Components, Server Actions) |
| 言語 | TypeScript 5 |
| UI | React 19, Tailwind CSS 4 |
| DB / ORM | PostgreSQL, Prisma 7 (`@prisma/adapter-pg`) |
| 認証 | bcryptjs, HMAC 署名付きセッション Cookie(自前実装) |
| 外部 API | TMDB API |
| 静的解析 | ESLint 9 |

## 設計・工夫したポイント

### フォルダ構成

```
app/
├── Common/        共通部品(定数・メッセージ・バリデーション・エラー処理・UIコンポーネント)
├── Script/
│   ├── Actions/   セッション / Cookie / Prisma など基盤処理
│   ├── APIs/      TMDB API クライアント
│   └── Functions/ ログイン・ユーザ登録・鑑賞記録の Server Actions
├── Types/         型定義
└── movie/         各ページ(Top / Login / NewUser / Search / MyPage / 映画詳細)
prisma/            スキーマ
```

画面(`movie/`)・業務ロジック(`Script/Functions`)・基盤処理(`Script/Actions`)・外部 API(`Script/APIs`)を分け、責務ごとにファイルを切り分けています。

### セキュリティ対策

学習目的として、実際のアプリで想定される攻撃への対策を意識して実装しています。

- **セッション管理**: ユーザ情報に有効期限と HMAC-SHA256 署名を付与した Cookie で管理し、改ざんによるなりすましを防止。署名の比較には `timingSafeEqual` を使用
- **Cookie 属性**: `httpOnly` / `secure` / `sameSite=strict` を付与(XSS・CSRF 対策)
- **パスワード**: bcrypt でハッシュ化。bcrypt の入力上限(72 バイト)を超える値は検証で拒否
- **入力値検証**: 全ての `FormData` を型チェックし、メール形式・評価範囲・日付の実在性(2/31 の繰り上がり除外)・文字数上限をサーバ側で検証
- **認可**: 認証が必要な処理は `requireUserInfo` で署名検証済みのユーザを確認し、未ログイン時はログイン画面へリダイレクト
- **サーバ専用モジュール**: `server-only` により、シークレットや API トークンを扱う処理のクライアント混入を防止
- **環境ごとの安全策**: 本番で `SESSION_SECRET` が未設定・32 文字未満ならエラー。開発用ダミーログインはサーバ側でも開発環境以外では拒否
- **HTTP ヘッダー**: `X-Frame-Options` / `X-Content-Type-Options` / `Referrer-Policy` / `Permissions-Policy` を付与し、`X-Powered-By` は無効化
- **サプライチェーン対策**: `.npmrc` で公開 7 日未満のバージョンを解決しない、install スクリプトは許可制、git 依存の禁止、バージョン固定保存を設定

### その他

- TMDB へのリクエスト処理を共通化し、検索 (5 分) / 詳細 (24 時間) でキャッシュ期間(`revalidate`)を使い分け
- ユーザ・映画・鑑賞記録は物理削除せず `deleteFlg` による論理削除
- 鑑賞記録には `userId` / `movieId` / `userId + watchedAt` のインデックスを設定

## データモデル

- `User`: メールアドレス(ユニーク)、パスワードハッシュ
- `Movie`: TMDB の映画 ID、タイトル、ポスター、公開日、ジャンル
- `MovieRecord`: ユーザの鑑賞記録(鑑賞日、評価、感想、お気に入り・再鑑賞・ネタバレ有無)

詳細は [prisma/schema.prisma](prisma/schema.prisma) を参照してください。

## セットアップ

### 必要なもの

- Node.js(npm)
- PostgreSQL
- TMDB の API アクセストークン

### 環境変数

プロジェクト直下に `.env` を作成します。

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/movielogs"
SESSION_SECRET="32文字以上のランダムな文字列"
TMDB_ACCESS_TOKEN="TMDB の API 読み取りアクセストークン"
TMDB_API_BASE_URL="https://api.themoviedb.org/3"
```

### 起動手順

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

http://localhost:3000 を開いて確認します。

### スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバ起動 |
| `npm run build` | Prisma Client 生成 + 本番ビルド |
| `npm run start` | 本番サーバ起動 |
| `npm run lint` | ESLint 実行 |

## 今後の課題

- 認証まわりの自動テストの追加
- 鑑賞方法(`ViewingMethod`)・お気に入りなどスキーマ上の項目の UI 対応
- 記録の絞り込み・並び替え、統計表示
- ログイン試行回数の制限

## クレジット

This product uses the TMDB API but is not endorsed or certified by TMDB.
