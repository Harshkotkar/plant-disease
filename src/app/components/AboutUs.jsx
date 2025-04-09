import React from 'react'

const AboutUs = () => {
  return (
    <div className="bg-green-700 py-16 px-4">
      {/* Main container */}
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
          About Us
        </h1>

        {/* Description text */}
        <p className="text-white text-center text-lg mb-16 max-w-4xl mx-auto">
          Our plant disease diagnosis platform combines advanced artificial intelligence with botanical expertise to 
          provide accurate and timely plant health assessments. We're dedicated to helping gardeners, farmers, and 
          plant enthusiasts maintain healthy plants and sustainable growing practices.
        </p>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* AI-Powered Analysis */}
          <div className="bg-green-600 p-8 rounded-lg">
            <div className="w-12 h-12 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">AI-Powered Analysis</h2>
            <p className="text-white">
              Our machine learning algorithms are trained on millions of plant disease images to provide accurate 
              diagnoses within seconds.
            </p>
          </div>

          {/* Research & Innovation */}
          <div className="bg-green-600 p-8 rounded-lg">
            <div className="w-12 h-12 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Research & Innovation</h2>
            <p className="text-white">
              We continuously collaborate with agricultural research institutions and stay at the forefront of 
              plant pathology advancements to provide cutting-edge solutions.
            </p>
          </div>

          {/* Sustainable Solutions */}
          <div className="bg-green-600 p-8 rounded-lg">
            <div className="w-12 h-12 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Sustainable Solutions</h2>
            <p className="text-white">
              We prioritize user friendly solutions and integrated pest management techniques in our 
              recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs