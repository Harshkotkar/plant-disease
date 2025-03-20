'use client';

import React, { useState, useEffect } from 'react';

const Translator = () => {
  const [showTranslate, setShowTranslate] = useState(false);

  useEffect(() => {
    // Load Google Translate Script if not already present
    const scriptId = 'google-translate-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', autoDisplay: false },
        'google_translate_element'
      );
    };

    // Ensure translation loads after script
    setTimeout(() => {
      if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      }
    }, 1000);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Google Translate Dropdown */}
      <div
        id="google_translate_element"
        className={`mb-2 p-2 bg-white border border-gray-300 rounded-lg shadow-lg transition-all ${
          showTranslate ? 'block' : 'hidden'
        }`}
      />

      {/* Toggle Button */}
      <button
        onClick={() => setShowTranslate(!showTranslate)}
        className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        <span className="font-medium text-green-600">
          {showTranslate ? 'Close' : 'Translate'}
        </span>
      </button>
    </div>
  );
};

// Translation Script Written By shoaibbshaikhh
export default Translator;

