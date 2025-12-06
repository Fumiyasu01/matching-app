'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-cyan-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </Link>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">利用規約</h1>

          <div className="prose prose-gray prose-sm max-w-none space-y-6 text-gray-600">
            <p className="text-sm text-gray-500">最終更新日: 2025年12月5日</p>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">第1条（適用）</h2>
              <p>
                本規約は、Matching（以下「本サービス」）の利用に関する条件を定めるものです。
                ユーザーは本規約に同意した上で、本サービスをご利用ください。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">第2条（サービス内容）</h2>
              <p>本サービスは、仕事やボランティア活動のマッチングを目的としたプラットフォームです。</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>プロフィールの作成・公開</li>
                <li>他のユーザーとのマッチング</li>
                <li>マッチしたユーザー間でのメッセージ交換</li>
                <li>募集情報の掲載</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">第3条（アカウント登録）</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>ユーザーは正確な情報を提供してアカウントを登録するものとします。</li>
                <li>1人につき1つのアカウントのみ登録可能です。</li>
                <li>アカウント情報の管理はユーザー自身の責任で行うものとします。</li>
                <li>18歳未満の方は本サービスをご利用いただけません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">第4条（禁止事項）</h2>
              <p>ユーザーは以下の行為を行ってはなりません。</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>虚偽の情報を登録する行為</li>
                <li>他のユーザーへの嫌がらせ、誹謗中傷</li>
                <li>営利目的の宣伝、勧誘行為</li>
                <li>マルチ商法、ネズミ講等への勧誘</li>
                <li>わいせつな内容の投稿、送信</li>
                <li>他人になりすます行為</li>
                <li>本サービスの運営を妨害する行為</li>
                <li>法令または公序良俗に反する行為</li>
                <li>その他、運営が不適切と判断する行為</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">第5条（コンテンツの権利）</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>ユーザーが投稿したコンテンツの著作権はユーザーに帰属します。</li>
                <li>ユーザーは、投稿したコンテンツについて、本サービスでの利用を許諾するものとします。</li>
                <li>他者の権利を侵害するコンテンツを投稿してはなりません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">第6条（免責事項）</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>本サービスは現状有姿で提供され、特定目的への適合性を保証するものではありません。</li>
                <li>ユーザー間のトラブルについて、運営は責任を負いません。</li>
                <li>本サービスを通じて成立した契約、取引について、運営は当事者ではありません。</li>
                <li>サービスの中断、データの消失等について、運営は責任を負いません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">第7条（個人情報の取扱い）</h2>
              <p>
                本サービスにおける個人情報の取扱いについては、別途定めるプライバシーポリシーに従うものとします。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">第8条（サービスの変更・終了）</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>運営は、事前の通知なくサービス内容を変更できるものとします。</li>
                <li>運営は、相当期間の予告をもって本サービスを終了できるものとします。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">第9条（アカウントの停止・削除）</h2>
              <p>
                運営は、ユーザーが本規約に違反した場合、事前の通知なくアカウントを停止または削除できるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">第10条（規約の変更）</h2>
              <p>
                運営は、必要に応じて本規約を変更できるものとします。
                変更後の規約は、本サービス上に掲載した時点で効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">第11条（準拠法・管轄）</h2>
              <p>
                本規約は日本法に準拠し、本サービスに関する紛争は東京地方裁判所を第一審の専属的合意管轄裁判所とします。
              </p>
            </section>
          </div>
        </div>

        {/* Privacy Policy Section */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100 mt-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">プライバシーポリシー</h1>

          <div className="prose prose-gray prose-sm max-w-none space-y-6 text-gray-600">
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-4 mb-3">収集する情報</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>アカウント情報（メールアドレス、表示名）</li>
                <li>プロフィール情報（自己紹介、スキル、興味関心など）</li>
                <li>利用状況（マッチング履歴、メッセージ内容）</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">情報の利用目的</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>本サービスの提供・運営</li>
                <li>ユーザーサポート</li>
                <li>サービスの改善・新機能の開発</li>
                <li>不正利用の防止</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">情報の第三者提供</h2>
              <p>
                法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">お問い合わせ</h2>
              <p>
                個人情報の取扱いに関するお問い合わせは、アプリ内のお問い合わせ機能よりご連絡ください。
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
