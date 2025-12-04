# マッチングアプリ開発ルール

## プロジェクト概要
Tinderライクなスワイプベースの仕事/ボランティアマッチングアプリ

## 技術スタック
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
- **Swipe UI**: react-tinder-card
- **Backend**: Supabase (PostgreSQL + Auth + Realtime + Storage)
- **State**: Zustand + TanStack Query
- **Form**: React Hook Form + Zod
- **Test**: Vitest + Playwright

---

## サブエージェントの活用原則

### 並列実行の最大化
- **複数の独立したタスクは常に並列実行する**
  - 単一メッセージ内で複数のTask tool呼び出しを行う
  - 依存関係のない調査・検索・ファイル読み込みは並行実行
  - 例: コードレビュー、テスト実行、ビルド検証を並列で実施

### サブエージェントタイプの適切な選択
| タイプ | 用途 |
|--------|------|
| Explore | コードベース探索、構造理解、エラー箇所特定 |
| Plan | 実装計画の策定、アーキテクチャ設計 |
| general-purpose | 複数ステップの複雑なタスク |

---

## Definition of Done (DoD)

### 各フェーズ終了時の必須チェック

#### 1. コードレビュー
```bash
git diff
git status
```
- セキュリティ脆弱性チェック（XSS, SQLインジェクション, コマンドインジェクション）
- OWASP Top 10 対応確認
- 未使用コードの完全削除

#### 2. プロダクションビルド
```bash
npm run build
```
- エラーゼロ確認
- 警告の確認と対処

#### 3. テスト実行
```bash
npm test
```
- 全テストパス確認
- 新規機能に対するテスト追加

---

## DoD並列実行パターン

各フェーズ終了時は以下を**必ず並列実行**:
```
単一メッセージ内で3つのTask tool呼び出し:
├── Agent 1 (general-purpose): コードレビュー
├── Agent 2 (general-purpose): プロダクションビルド
└── Agent 3 (general-purpose): テスト実行
```

---

## セキュリティチェックリスト

- [ ] XSS対策（ユーザー入力のサニタイズ）
- [ ] SQLインジェクション対策（Supabase RLS使用）
- [ ] 認証・認可の適切な実装
- [ ] 機密情報のハードコーディング排除
- [ ] HTTPS強制
- [ ] ファイルアップロードのサイズ/形式制限

---

## ファイル構造規約

```
src/
├── app/          # Next.js App Router
├── components/   # UIコンポーネント
├── lib/          # ユーティリティ、Supabaseクライアント
├── hooks/        # カスタムフック
├── stores/       # Zustandストア
├── types/        # 型定義
└── validations/  # Zodスキーマ
```

---

## コミット規約

- feat: 新機能
- fix: バグ修正
- docs: ドキュメント
- style: フォーマット
- refactor: リファクタリング
- test: テスト
- chore: その他

---

## 開発フロー

1. **計画**: TodoWriteでタスク分解
2. **実装**: 並列エージェントで効率的に実装
3. **完了**: DoD並列実行（レビュー/ビルド/テスト）
4. **次フェーズへ**
