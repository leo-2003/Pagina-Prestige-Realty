
import React, { useState, useEffect } from 'react';
import { PhoneIcon, ArrowUpIcon } from '@heroicons/react/24/solid';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.459L0 24zM7.312 21.26l.444.263c1.492.889 3.23.982 4.908.982 5.454 0 9.917-4.463 9.917-9.917s-4.463-9.917-9.917-9.917-9.917 4.464-9.917 9.917c0 2.308.847 4.4 2.308 6.03l.353.49-1.127 4.108 4.238-1.096zM12 5.567c.33 0 .65.06.96.18s.59.28.85.49c.26.21.49.46.68.74s.35.58.46.9c.12.31.18.63.18.96s-.06.65-.18.96c-.11.32-.27.62-.46.9s-.42.53-.68.74c-.26.21-.55.37-.85.49s-.63.18-.96.18c-.66 0-1.3-.13-1.88-.38s-1.1-.6-1.53-1.03c-.43-.43-.78-.95-1.03-1.53s-.38-1.22-.38-1.88c0-1.38.56-2.63 1.46-3.54s2.16-1.46 3.54-1.46z"/>
    </svg>
);


const StickyButtons: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center space-y-4">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/1234567890" // Replace with your WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 p-3 rounded-full shadow-lg transition-transform transform hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon />
      </a>

      {/* Call Button (Mobile Only) */}
      <a
        href="tel:123-456-7890"
        className="md:hidden bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110"
        aria-label="Call Us"
      >
        <PhoneIcon className="h-6 w-6" />
      </a>

      {/* Back to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-full shadow-lg transition-opacity duration-300"
          aria-label="Go to top"
        >
          <ArrowUpIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default StickyButtons;
