export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-400 via-orange-300 to-amber-200">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large gradient blob - top right */}
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-60 animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(251,113,133,0.8) 0%, rgba(253,186,116,0.4) 70%, transparent 100%)',
            animationDuration: '8s',
          }}
        />

        {/* Medium blob - bottom left */}
        <div
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-50 animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.6) 0%, rgba(56,189,248,0.3) 70%, transparent 100%)',
            animationDuration: '10s',
            animationDelay: '1s',
          }}
        />

        {/* Small accent blob - center left */}
        <div
          className="absolute top-1/3 -left-10 w-40 h-40 rounded-full opacity-40 animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(249,115,22,0.7) 0%, rgba(251,146,60,0.3) 70%, transparent 100%)',
            animationDuration: '6s',
            animationDelay: '2s',
          }}
        />

        {/* Tiny decorative circles */}
        <div className="absolute top-20 left-1/4 w-4 h-4 rounded-full bg-white/40 animate-float" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/2 right-1/4 w-6 h-6 rounded-full bg-white/30 animate-float" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/3 w-3 h-3 rounded-full bg-white/50 animate-float" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
