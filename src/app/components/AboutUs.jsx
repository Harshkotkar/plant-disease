import React from 'react'

const AboutUs = () => {
  return (
    <div className="bg-green-500 py-16 px-4">
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

          {/* Expert Team */}
          <div className="bg-green-600 p-8 rounded-lg">
            <div className="w-12 h-12 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Expert Team</h2>
            <p className="text-white">
              Our platform is developed and maintained by a team of botanists, pathologists, and software engineers 
              passionate about plant health.
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
              We prioritize environmentally friendly solutions and integrated pest management techniques in our 
              recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs