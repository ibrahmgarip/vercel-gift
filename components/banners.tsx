import React from 'react';

const Banner = () => {
  return (
    <div className="w-7xl max-w-7xl flex items-center justify-center mx-auto px-4 mt-2">
      <div className="w-full h-full flex rounded-lg overflow-hidden">
        <div className="w-1/3 h-full mt-2 mb-2 mr-2 rounded-lg overflow-hidden">
          <img 
            src="/slideshow.webp" 
            alt="Slideshow" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-1/3 h-full mt-2 mb-2 mx-2 rounded-lg overflow-hidden">
          <img 
            src="/slideshow.webp" 
            alt="Slideshow" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-1/3 h-full mt-2 mb-2 ml-2 rounded-lg overflow-hidden">
          <img 
            src="/slideshow.webp" 
            alt="Slideshow" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
