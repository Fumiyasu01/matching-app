export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large gradient blob - top right */}
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-30 animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.5) 0%, rgba(20,184,166,0.2) 70%, transparent 100%)',
            animationDuration: '8s',
          }}
        />

        {/* Medium blob - bottom left */}
        <div
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-30 animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(34,211,238,0.2) 70%, transparent 100%)',
            animationDuration: '10s',
            animationDelay: '1s',
          }}
        />

        {/* Small accent blob - center */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(20,184,166,0.3) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
