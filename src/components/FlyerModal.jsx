import { useState, useEffect } from 'react';
import sharkverseFlyer from '../assets/genesis/sharkverse.jpeg';

const FlyerModal = () => {
  const [showFlyer, setShowFlyer] = useState(false);

  useEffect(() => {
    // Check if user has already closed the flyer today
    const lastClosed = localStorage.getItem('sharkverseFlyerClosed');
    const today = new Date().toDateString();
    
    if (lastClosed !== today) {
      // Show flyer after a short delay for better UX
      const timer = setTimeout(() => {
        setShowFlyer(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!showFlyer) return;

    // Handle ESC key press
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showFlyer]);

  const handleClose = () => {
    setShowFlyer(false);
    // Store that the flyer was closed today
    localStorage.setItem('sharkverseFlyerClosed', new Date().toDateString());
  };

  if (!showFlyer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors duration-300 z-10"
          aria-label="Close flyer"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Flyer Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <img
            src={sharkverseFlyer}
            alt="Sharkverse Event Flyer"
            className="w-full h-auto object-cover"
          />
          
          {/* Gradient Overlay at bottom with close hint */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 text-center">
            <p className="text-gray-300 text-sm">Click anywhere or press ESC to close</p>
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={handleClose}
      />
    </div>
  );
};

export default FlyerModal;
