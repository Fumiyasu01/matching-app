export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // チャットページはフルスクリーンで表示
  // BottomNavは親レイアウトで表示されるが、この部分はオーバーライド
  return (
    <div className="fixed inset-0 flex flex-col bg-background z-50">
      {children}
    </div>
  )
}
