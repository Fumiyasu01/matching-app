// App configuration based on environment variables

/**
 * モックモードの設定
 *
 * 環境変数 NEXT_PUBLIC_USE_MOCK_DATA で切り替え可能:
 * - "true": モックデータを使用（デモ用、ユーザー同士の交流不可）
 * - "false": 本番モード（Supabase使用、実際のユーザー同士がマッチング・チャット可能）
 *
 * デフォルト: true（安全のため）
 */
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false'

/**
 * アプリ設定
 */
export const config = {
  useMockData: USE_MOCK_DATA,
  appName: 'Matching',
  matchProbability: 0.7, // モックモードでのマッチ確率（70%）
}
