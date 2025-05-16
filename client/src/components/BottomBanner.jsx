import React from 'react';
import { assets, features } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const BottomBanner = () => {
  const Navigate = useNavigate();
  return (
    <div className="relative mt-24 bg-gradient-to-r from-primary/5 to-primary/10 py-16 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-secondary blur-xl"></div>
      </div>

      {/* Content container */}
      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image section - replaced with modern illustration */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full mix-blend-multiply opacity-20 animate-pulse"></div>
            </div>
          </div>

          {/* Features section */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
              Experience the <span className="text-primary">Nellai Difference</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <img 
                        src={feature.icon} 
                        alt={feature.title} 
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={()=>Navigate("/products")} className="mt-10 px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
              Shop Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;