import React from 'react';


const Slideshow = () => {
  return (
    <div className="w-full max-w-7xl h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center mx-auto px-4 mt-2">
      <div className="w-full h-full flex rounded-lg overflow-hidden">
        <div className="w-1/2 h-full">
          <img 
            src="/slideshow.webp" 
            alt="Slideshow" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-1/2 h-full flex flex-col items-center justify-center" style={{backgroundColor: '#016241'}}>
              <h2 className="text-white text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-serif text-center flex flex-col items-center">
              <div>Babalar</div>
              <div>Gününe</div>
              <div>Özel</div>
              </h2>
        </div>
      </div>
    </div>
  );
};

export default Slideshow;