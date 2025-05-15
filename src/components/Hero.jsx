import React, { useEffect } from "react";
import Image from "../assets/Image.jpg";

const Hero = () => {
  useEffect(() => {
    // Animation for text elements when component mounts
    const animateElements = () => {
      const elements = document.querySelectorAll('.animate-in');
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.remove('opacity-0');
          element.classList.add('translate-y-0');
        }, 200 * index);
      });
    };
    
    animateElements();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center min-h-[50vh] shadow-lg overflow-hidden bg-gray-50">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-12 px-6">
        <div className="text-[#414141] text-center sm:text-left max-w-lg">
          {/* Products Section */}
          <div className="flex items-center gap-1 justify-center sm:justify-start mb-3">
            <p className="font-medium text-sm md:text-lg animate-in opacity-0 -translate-y-4 transition duration-500">
              Creative Furniture Collections
            </p>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:py-3 lg:text-4xl xl:text-5xl leading-tight font-bold mb-6 animate-in opacity-0 -translate-y-4 transition duration-500 delay-100">
            We sell the best <br /> <span className="text-[#FF4D00]">Furniture</span> in Nigeria
          </h1>

          {/* Shop Now Button */}
          <a href="/collection" className="inline-block animate-in opacity-0 -translate-y-4 transition duration-500 delay-200">
            <button className="bg-blue-800 hover:bg-blue-900 text-white font-medium py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
              SHOP NOW
              <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </button>
          </a>
        </div>
      </div>

      {/* Hero Right Side with Full Image */}
      <div className="w-full sm:w-1/2 h-full overflow-hidden">
        <img
          className="w-full h-full object-cover hover:scale-105 transition duration-700 animate-in opacity-0 -translate-y-4 delay-300"
          src={Image}
          alt="Luxury Furniture Collection"
        />
      </div>
    </div>
  );
};

export default Hero;
