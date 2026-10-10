export default function LoginAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 400 400"
          className="w-80 h-80 drop-shadow-2xl"
          style={{ animation: 'floatSlow 6s ease-in-out infinite' }}
        >
          <rect x="80" y="280" width="240" height="12" rx="4" fill="#1e2b74" />
          <rect x="100" y="292" width="8" height="60" fill="#1e2b74" />
          <rect x="292" y="292" width="8" height="60" fill="#1e2b74" />

          <rect x="160" y="250" width="80" height="30" rx="3" fill="#334155" />
          <rect x="155" y="278" width="90" height="4" rx="2" fill="#1e293b" />
          <rect x="162" y="200" width="76" height="52" rx="2" fill="#0f172a" />
          <rect x="166" y="204" width="68" height="44" rx="1" fill="#3b5fff" opacity="0.9" />

          <line x1="172" y1="215" x2="200" y2="215" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
          <line x1="172" y1="222" x2="220" y2="222" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <line x1="172" y1="229" x2="210" y2="229" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

          <ellipse cx="200" cy="255" rx="22" ry="20" fill="#2540e0" />
          <circle cx="200" cy="215" r="22" fill="#fcd5b5" />

          <path d="M 178 212 Q 178 190 200 190 Q 222 190 222 212 Q 222 200 200 198 Q 178 200 178 212 Z" fill="#1e293b" />

          <circle cx="193" cy="215" r="1.8" fill="#1e293b" />
          <circle cx="207" cy="215" r="1.8" fill="#1e293b" />
          <path d="M 195 223 Q 200 227 205 223" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          <path d="M 178 245 Q 165 260 170 275" stroke="#2540e0" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 222 245 Q 235 260 230 275" stroke="#2540e0" strokeWidth="8" fill="none" strokeLinecap="round" />

          <g style={{ animation: 'floatBook1 4s ease-in-out infinite' }}>
            <rect x="60" y="140" width="45" height="55" rx="2" fill="#f59e0b" />
            <rect x="60" y="140" width="8" height="55" fill="#d97706" />
          </g>

          <g style={{ animation: 'floatBook2 5s ease-in-out infinite' }}>
            <rect x="305" y="120" width="50" height="60" rx="2" fill="#10b981" />
            <rect x="305" y="120" width="8" height="60" fill="#059669" />
          </g>

          <g style={{ animation: 'floatCap 4.5s ease-in-out infinite' }}>
            <rect x="280" y="220" width="45" height="8" rx="1" fill="#1e293b" />
            <polygon points="302,200 280,215 302,220 324,215" fill="#1e293b" />
            <rect x="320" y="215" width="2" height="12" fill="#fbbf24" />
            <circle cx="321" cy="228" r="2.5" fill="#fbbf24" />
          </g>

          <g style={{ animation: 'floatBulb 3.5s ease-in-out infinite' }}>
            <circle cx="130" cy="100" r="14" fill="#fbbf24" opacity="0.9" />
            <circle cx="130" cy="100" r="20" fill="#fbbf24" opacity="0.2" />
          </g>
        </svg>
      </div>

      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes floatBook1 {
          0%, 100% { transform: translate(0, 0) rotate(-8deg); }
          50% { transform: translate(-8px, -15px) rotate(-3deg); }
        }
        @keyframes floatBook2 {
          0%, 100% { transform: translate(0, 0) rotate(10deg); }
          50% { transform: translate(8px, -18px) rotate(4deg); }
        }
        @keyframes floatCap {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(0, -12px) rotate(-5deg); }
        }
        @keyframes floatBulb {
          0%, 100% { transform: translate(0, 0); opacity: 0.9; }
          50% { transform: translate(0, -8px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}