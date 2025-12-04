import { config } from '@/lib/config'
import type { Profile, Match, Message } from '@/types/database'

// Mock state management (in-memory for demo)
class MockStore {
  private swipedIds: Set<string> = new Set()
  private matches: Map<string, Match> = new Map()
  private messages: Map<string, Message[]> = new Map()

  // Mark a profile as swiped
  addSwipe(profileId: string) {
    this.swipedIds.add(profileId)
  }

  // Check if profile was swiped
  hasSwiped(profileId: string): boolean {
    return this.swipedIds.has(profileId)
  }

  // Get un-swiped profiles
  getUnswipedProfiles(): Profile[] {
    return mockProfiles.filter(p => !this.swipedIds.has(p.id))
  }

  // Create a match
  createMatch(profileId: string): Match {
    const matchId = `match-${profileId}`
    const match: Match = {
      id: matchId,
      user1_id: 'current-user',
      user2_id: profileId,
      created_at: new Date().toISOString(),
    }
    this.matches.set(matchId, match)
    this.messages.set(matchId, [])
    return match
  }

  // Get all matches
  getMatches(): Match[] {
    return Array.from(this.matches.values())
  }

  // Get match by ID
  getMatch(matchId: string): Match | undefined {
    return this.matches.get(matchId)
  }

  // Get messages for a match
  getMessages(matchId: string): Message[] {
    return this.messages.get(matchId) || []
  }

  // Add a message
  addMessage(matchId: string, content: string, senderId: string): Message {
    const messages = this.messages.get(matchId) || []
    const message: Message = {
      id: `msg-${Date.now()}`,
      match_id: matchId,
      sender_id: senderId,
      content,
      read_at: senderId === 'current-user' ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
    }
    messages.push(message)
    this.messages.set(matchId, messages)

    // Auto-reply after 1.5 seconds (for demo)
    if (senderId === 'current-user') {
      setTimeout(() => {
        const match = this.matches.get(matchId)
        if (match) {
          const profile = mockProfiles.find(p => p.id === match.user2_id)
          if (profile) {
            const replies = [
              'こんにちは！マッチありがとうございます！',
              'はじめまして！よろしくお願いします！',
              'プロフィール見ました！とても興味があります！',
              'お返事ありがとうございます！ぜひお話ししましょう！',
              'いいですね！もっと詳しく教えてください！',
              'お仕事の話、聞きたいです！',
              '素敵なスキルをお持ちですね！',
              'ぜひコラボしたいです！',
            ]
            const reply = replies[Math.floor(Math.random() * replies.length)]
            this.addMessage(matchId, reply, match.user2_id)
          }
        }
      }, 1500)
    }

    return message
  }

  // Mark messages as read
  markAsRead(matchId: string) {
    const messages = this.messages.get(matchId) || []
    messages.forEach(msg => {
      if (msg.sender_id !== 'current-user') {
        msg.read_at = new Date().toISOString()
      }
    })
  }

  // Reset store (for testing)
  reset() {
    this.swipedIds.clear()
    this.matches.clear()
    this.messages.clear()
  }
}

export const mockStore = new MockStore()

// Determine if a swipe results in a match
export function shouldMatch(): boolean {
  return Math.random() < config.matchProbability
}

// Mock profiles for testing (30 profiles)
export const mockProfiles: Profile[] = [
  {
    id: 'mock-1',
    email: 'yuki.tanaka@example.com',
    display_name: '田中 優希',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'UIデザイナー歴5年。最近はFigmaでデザインシステム構築にハマっています。コーヒーとNetflixが好き。',
    location: '東京都渋谷区',
    looking_for: 'work',
    skills: ['Figma', 'UI/UX', 'Adobe XD', 'Sketch', 'Prototyping'],
    interests: ['デザイン', 'カフェ巡り', '映画鑑賞'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    email: 'kenji.yamamoto@example.com',
    display_name: '山本 健二',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'フルスタックエンジニア。React/Next.jsが得意。オープンソース活動にも興味あり。週末はバスケしてます。',
    location: '神奈川県横浜市',
    looking_for: 'both',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
    interests: ['プログラミング', 'バスケ', 'ゲーム'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    email: 'sakura.ito@example.com',
    display_name: '伊藤 さくら',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    bio: 'マーケティング × データ分析が専門。スタートアップでグロースハックしてます。旅行が趣味で年3回は海外へ。',
    location: '東京都目黒区',
    looking_for: 'work',
    skills: ['マーケティング', 'データ分析', 'Python', 'SQL', 'Google Analytics'],
    interests: ['旅行', 'ヨガ', '読書'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-4',
    email: 'takeshi.sato@example.com',
    display_name: '佐藤 武',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'プロダクトマネージャー。元エンジニアでスクラム導入が得意。チームビルディングとファシリテーションが好き。',
    location: '東京都港区',
    looking_for: 'volunteer',
    skills: ['プロダクトマネジメント', 'Scrum', 'JIRA', 'ユーザーインタビュー'],
    interests: ['アジャイル', 'キャンプ', '料理'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-5',
    email: 'mika.suzuki@example.com',
    display_name: '鈴木 美香',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    bio: 'iOSエンジニア3年目。SwiftUIにどっぷり。個人アプリを5本リリース済み。猫を2匹飼ってます。',
    location: '大阪府大阪市',
    looking_for: 'work',
    skills: ['Swift', 'SwiftUI', 'iOS', 'Firebase', 'Core Data'],
    interests: ['アプリ開発', '猫', 'カメラ'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-6',
    email: 'ryo.watanabe@example.com',
    display_name: '渡辺 亮',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    bio: 'バックエンドエンジニア。Go言語とマイクロサービスアーキテクチャが専門。技術ブログ毎週更新中。',
    location: '福岡県福岡市',
    looking_for: 'both',
    skills: ['Go', 'Kubernetes', 'Docker', 'gRPC', 'MySQL'],
    interests: ['技術ブログ', 'ランニング', 'サウナ'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-7',
    email: 'emi.nakamura@example.com',
    display_name: '中村 恵美',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    bio: 'フリーランスのイラストレーター兼デザイナー。企業ロゴからキャラクターデザインまで幅広く対応。',
    location: '京都府京都市',
    looking_for: 'work',
    skills: ['イラスト', 'Photoshop', 'Illustrator', 'Procreate', 'ブランディング'],
    interests: ['アート', '神社巡り', '抹茶'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-8',
    email: 'daiki.kato@example.com',
    display_name: '加藤 大輝',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    bio: 'データサイエンティスト。機械学習モデルの開発と運用が得意。Kaggleコンペにも参加してます。',
    location: '東京都新宿区',
    looking_for: 'volunteer',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'BigQuery'],
    interests: ['機械学習', 'Kaggle', '将棋'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-9',
    email: 'ayaka.yoshida@example.com',
    display_name: '吉田 彩香',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    bio: 'コンテンツマーケター。SEO記事からSNS運用まで。副業でWebライターもやってます。',
    location: '愛知県名古屋市',
    looking_for: 'both',
    skills: ['SEO', 'コンテンツ制作', 'SNSマーケ', 'WordPress', 'ライティング'],
    interests: ['ブログ', 'カフェ', '韓国ドラマ'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-10',
    email: 'shota.tanaka@example.com',
    display_name: '田中 翔太',
    avatar_url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop',
    bio: 'フロントエンドエンジニア。Vue.js/Nuxt.jsが得意。アクセシビリティとパフォーマンス最適化に興味あり。',
    location: '北海道札幌市',
    looking_for: 'work',
    skills: ['Vue.js', 'Nuxt.js', 'TypeScript', 'Tailwind CSS', 'Vite'],
    interests: ['OSS貢献', 'スノーボード', 'クラフトビール'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-11',
    email: 'nanami.kobayashi@example.com',
    display_name: '小林 七海',
    avatar_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop',
    bio: 'UXリサーチャー。ユーザーインタビューとプロトタイプ検証が専門。人間中心設計を大切にしています。',
    location: '東京都世田谷区',
    looking_for: 'work',
    skills: ['UXリサーチ', 'ユーザビリティテスト', 'Figma', 'Miro', 'インタビュー'],
    interests: ['心理学', 'ボードゲーム', 'ワイン'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-12',
    email: 'hiroshi.matsuda@example.com',
    display_name: '松田 浩',
    avatar_url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop',
    bio: 'インフラエンジニア歴10年。AWS/GCPの設計構築からコスト最適化まで。SREにも興味あり。',
    location: '東京都千代田区',
    looking_for: 'both',
    skills: ['AWS', 'GCP', 'Terraform', 'Ansible', 'Linux'],
    interests: ['クラウド技術', '登山', 'コーヒー焙煎'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-13',
    email: 'yui.hashimoto@example.com',
    display_name: '橋本 結衣',
    avatar_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
    bio: 'Webディレクター。大手制作会社で5年、現在フリーランス。プロジェクト管理とクライアント折衝が得意。',
    location: '東京都中央区',
    looking_for: 'work',
    skills: ['ディレクション', 'プロジェクト管理', 'Notion', 'Slack', 'ワイヤーフレーム'],
    interests: ['美術館巡り', 'ピラティス', 'インテリア'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-14',
    email: 'kazuki.ogawa@example.com',
    display_name: '小川 和樹',
    avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
    bio: 'セキュリティエンジニア。脆弱性診断とペネトレーションテストが専門。CTFにも参加してます。',
    location: '東京都品川区',
    looking_for: 'volunteer',
    skills: ['セキュリティ診断', 'Python', 'Burp Suite', 'OWASP', 'ネットワーク'],
    interests: ['CTF', 'ハッキング', 'SF小説'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-15',
    email: 'mai.yamada@example.com',
    display_name: '山田 麻衣',
    avatar_url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop',
    bio: 'Androidエンジニア。Kotlinでモダンな開発が好き。Jetpack Composeにどっぷり。',
    location: '兵庫県神戸市',
    looking_for: 'work',
    skills: ['Kotlin', 'Android', 'Jetpack Compose', 'Firebase', 'Coroutines'],
    interests: ['モバイル開発', 'ダンス', 'スイーツ'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-16',
    email: 'taro.ishikawa@example.com',
    display_name: '石川 太郎',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    bio: 'スタートアップCTO経験者。技術戦略とチームビルディングが得意。エンジニア採用支援もしてます。',
    location: '東京都渋谷区',
    looking_for: 'both',
    skills: ['技術戦略', 'チームビルディング', '採用', 'アーキテクチャ設計', 'React'],
    interests: ['スタートアップ', '投資', 'ゴルフ'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-17',
    email: 'rina.mori@example.com',
    display_name: '森 里奈',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    bio: '動画クリエイター。YouTube運営からTikTok編集まで。Premiere ProとAfter Effectsが得意。',
    location: '東京都目黒区',
    looking_for: 'work',
    skills: ['動画編集', 'Premiere Pro', 'After Effects', 'YouTube', 'TikTok'],
    interests: ['映像制作', 'Vlog', '音楽フェス'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-18',
    email: 'yusuke.takahashi@example.com',
    display_name: '高橋 優介',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    bio: 'DevOpsエンジニア。CI/CDパイプライン構築と自動化が専門。GitOpsの導入支援もしてます。',
    location: '東京都江東区',
    looking_for: 'volunteer',
    skills: ['CI/CD', 'GitHub Actions', 'ArgoCD', 'Jenkins', 'Docker'],
    interests: ['自動化', 'DIY', 'キャンプ'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-19',
    email: 'chihiro.aoki@example.com',
    display_name: '青木 千尋',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    bio: 'HR Tech企業で人事システム開発。採用から組織開発まで幅広く。副業でキャリアコーチも。',
    location: '東京都港区',
    looking_for: 'both',
    skills: ['人事システム', 'Ruby on Rails', 'データ分析', '組織開発', 'コーチング'],
    interests: ['HR Tech', 'キャリア支援', 'ランニング'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-20',
    email: 'kenta.nishimura@example.com',
    display_name: '西村 健太',
    avatar_url: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop',
    bio: 'ゲーム開発者。Unityでのモバイルゲーム開発が専門。インディーゲームもリリースしてます。',
    location: '大阪府大阪市',
    looking_for: 'work',
    skills: ['Unity', 'C#', 'ゲームデザイン', '3Dモデリング', 'Blender'],
    interests: ['ゲーム開発', 'eスポーツ', 'アニメ'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-21',
    email: 'haruka.fujita@example.com',
    display_name: '藤田 遥',
    avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
    bio: 'テクニカルライター。API文書からユーザーマニュアルまで。英語ドキュメントの翻訳も対応可能。',
    location: '神奈川県川崎市',
    looking_for: 'work',
    skills: ['テクニカルライティング', 'API文書', 'Markdown', '翻訳', 'Git'],
    interests: ['ドキュメンテーション', '語学学習', '紅茶'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-22',
    email: 'naoki.shimizu@example.com',
    display_name: '清水 直樹',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80',
    bio: 'ブロックチェーンエンジニア。スマートコントラクト開発とDeFiが専門。Web3の未来を信じてます。',
    location: '東京都港区',
    looking_for: 'both',
    skills: ['Solidity', 'Ethereum', 'Web3.js', 'DeFi', 'NFT'],
    interests: ['暗号資産', 'Web3', '分散システム'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-23',
    email: 'megumi.saito@example.com',
    display_name: '斎藤 恵',
    avatar_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop',
    bio: 'アクセシビリティ専門家。Webアクセシビリティの診断と改善支援。JIS X 8341-3対応も。',
    location: '東京都文京区',
    looking_for: 'volunteer',
    skills: ['アクセシビリティ', 'WCAG', 'スクリーンリーダー', 'HTML', 'WAI-ARIA'],
    interests: ['インクルーシブデザイン', '手話', '茶道'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-24',
    email: 'ryota.endo@example.com',
    display_name: '遠藤 亮太',
    avatar_url: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=400&fit=crop',
    bio: 'QAエンジニア。テスト自動化とCI/CD連携が得意。品質を守るのが使命です。',
    location: '千葉県千葉市',
    looking_for: 'work',
    skills: ['テスト自動化', 'Selenium', 'Cypress', 'Jest', 'テスト設計'],
    interests: ['品質管理', 'ボルダリング', 'クラフトビール'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-25',
    email: 'akane.kimura@example.com',
    display_name: '木村 茜',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
    bio: '3Dデザイナー。Blenderでのモデリングとアニメーションが専門。VTuberモデル制作も。',
    location: '東京都杉並区',
    looking_for: 'work',
    skills: ['Blender', '3Dモデリング', 'アニメーション', 'VTuber', 'Substance'],
    interests: ['3DCG', 'VR', 'コスプレ'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-26',
    email: 'sho.inoue@example.com',
    display_name: '井上 翔',
    avatar_url: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop',
    bio: 'MLOpsエンジニア。機械学習モデルのデプロイと運用が専門。MLflowとKubeflowが得意。',
    location: '東京都渋谷区',
    looking_for: 'both',
    skills: ['MLOps', 'MLflow', 'Kubeflow', 'Python', 'Kubernetes'],
    interests: ['機械学習', 'データエンジニアリング', 'サッカー'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-27',
    email: 'misaki.honda@example.com',
    display_name: '本田 美咲',
    avatar_url: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop',
    bio: 'カスタマーサクセス × エンジニアリング。SaaSのオンボーディング設計と自動化が専門。',
    location: '東京都品川区',
    looking_for: 'work',
    skills: ['カスタマーサクセス', 'オンボーディング', 'データ分析', 'SQL', 'Zapier'],
    interests: ['SaaS', 'UX改善', 'ヨガ'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-28',
    email: 'takumi.okada@example.com',
    display_name: '岡田 匠',
    avatar_url: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=400&h=400&fit=crop',
    bio: 'フルスタック × AI。ChatGPT API連携やLLMアプリ開発が得意。プロンプトエンジニアリングも。',
    location: '東京都目黒区',
    looking_for: 'volunteer',
    skills: ['LLM', 'ChatGPT API', 'Python', 'Next.js', 'プロンプトエンジニアリング'],
    interests: ['生成AI', '自然言語処理', '読書'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-29',
    email: 'natsuki.hayashi@example.com',
    display_name: '林 夏希',
    avatar_url: 'https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=400&h=400&fit=crop',
    bio: 'デザインエンジニア。FigmaからReactへのコンポーネント実装が得意。デザインシステム構築も。',
    location: '東京都港区',
    looking_for: 'work',
    skills: ['Figma', 'React', 'Storybook', 'デザインシステム', 'CSS-in-JS'],
    interests: ['デザインエンジニアリング', 'UIアニメーション', 'フェス'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-30',
    email: 'koichi.morita@example.com',
    display_name: '森田 浩一',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80',
    bio: 'エンジニアリングマネージャー。チーム立ち上げから成長支援まで。1on1とピープルマネジメントが得意。',
    location: '東京都新宿区',
    looking_for: 'both',
    skills: ['エンジニアリングマネジメント', '1on1', 'OKR', 'チームビルディング', 'アジャイル'],
    interests: ['組織論', 'コーチング', 'トレイルラン'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]
