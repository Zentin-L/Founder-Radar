import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950">
      <div className="text-center space-y-8 px-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-indigo-400 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Live Signal Feed
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-indigo-200">
            Founder Radar
          </h1>
          <p className="text-xl text-gray-400 max-w-lg mx-auto">
            Discover breakout startups before they raise. Real-time hiring and growth signals for VC analysts.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg shadow-indigo-500/25"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium rounded-lg transition-colors duration-200 border border-gray-700"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 backdrop-blur-sm">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-semibold text-white mb-1">Momentum Score</h3>
            <p className="text-sm text-gray-400">0-100 score tracking hiring velocity and LinkedIn growth in real-time.</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 backdrop-blur-sm">
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-semibold text-white mb-1">7,000+ Startups</h3>
            <p className="text-sm text-gray-400">YC alumni, Product Hunt launches, and curated high-growth sectors.</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 backdrop-blur-sm">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-white mb-1">Signal Feed</h3>
            <p className="text-sm text-gray-400">Bloomberg-style feed showing which startups are heating up RIGHT NOW.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
