export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Step 3: AI Agents System
          </h1>
          <p className="text-lg text-gray-600">
            Autonomous AI agents for Global News App using Google AI services
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-left">
            <h2 className="text-2xl font-semibold mb-4">Available Endpoints</h2>
            <div className="space-y-4">
              <div>
                <code className="bg-gray-100 px-3 py-1 rounded">GET /api/agents</code>
                <p className="text-sm text-gray-600 mt-1">Get agent status and performance metrics</p>
              </div>
              <div>
                <code className="bg-gray-100 px-3 py-1 rounded">GET /api/news</code>
                <p className="text-sm text-gray-600 mt-1">Get processed news with AI summaries</p>
              </div>
              <div>
                <code className="bg-gray-100 px-3 py-1 rounded">POST /api/news</code>
                <p className="text-sm text-gray-600 mt-1">Trigger news processing pipeline</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold mb-2">🔄 Loop Agent</h3>
              <p className="text-sm text-gray-600">
                Fetches news from NewsAPI every 10 minutes
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold mb-2">📝 Summarizer Agent</h3>
              <p className="text-sm text-gray-600">
                AI-powered summaries using Google Gemini
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold mb-2">✅ Fact-Check Agent</h3>
              <p className="text-sm text-gray-600">
                Multi-source verification with credibility scores
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Integration Ready</h3>
            <p className="text-blue-700">
              This Step 3 implementation provides the AI agent backend that your teammates can integrate with Steps 1, 2, and 4.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
