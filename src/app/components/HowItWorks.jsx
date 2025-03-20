import React from 'react'

const HowItWorks = () => {
  return (
    <div className="bg-green-50 py-8 sm:py-12 px-4">
      <h2 className="text-green-800 text-2xl sm:text-3xl font-semibold text-center mb-8 sm:mb-12">How It Works</h2>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center p-4">
          <div className="bg-green-100 hover:bg-green-200 p-4 sm:p-6 rounded-full mb-3 sm:mb-4 transform transition-all duration-300 hover:scale-110">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">1. Upload Image</h3>
          <p className="text-gray-600 text-sm sm:text-base">Take a clear photo of your plant showing the affected areas and upload it to our system.</p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center text-center p-4">
          <div className="bg-green-100 hover:bg-green-200 p-4 sm:p-6 rounded-full mb-3 sm:mb-4 transform transition-all duration-300 hover:scale-110">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">2. Provide Location</h3>
          <p className="text-gray-600 text-sm sm:text-base">Enter your location to help us provide region-specific recommendations for treatment.</p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center text-center p-4">
          <div className="bg-green-100 hover:bg-green-200 p-4 sm:p-6 rounded-full mb-3 sm:mb-4 transform transition-all duration-300 hover:scale-110">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">3. Get Analysis</h3>
          <p className="text-gray-600 text-sm sm:text-base">Receive detailed insights about the disease, its causes, prevention methods, and treatment options.</p>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks