export default function FeedPage() {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Signal Feed</h2>
                <p className="text-gray-400 text-sm mt-1">Startups showing unusual growth momentum</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-12 text-center">
                <div className="text-4xl mb-4">📡</div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Your signal feed is coming soon</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Once signal pipelines are active, you&apos;ll see real-time hiring and LinkedIn growth signals here,
                    ranked by Momentum Score.
                </p>
            </div>
        </div>
    );
}
