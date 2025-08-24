'use client'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-6xl font-bold text-gray-900 mb-4">500</h2>
            <p className="text-xl text-gray-600 mb-8">Something went wrong!</p>
            <p className="text-gray-500 mb-8">An error occurred while processing your request</p>
            <button
              onClick={() => reset()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
