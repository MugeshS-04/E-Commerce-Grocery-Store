import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Banner data with images and taglines
  const banners = [
    {
      image: assets.one,
      mobileImage: assets.main_banner_bg_sm,
      tagline: "Quality Groceries, Exceptional Value!",
      buttonText: "Shop Now"
    },
    {
      image: assets.two,
      mobileImage: assets.main_banner_bg_sm2,
      tagline: "Fresh Produce Delivered to Your Doorstep",
      buttonText: "Order Today"
    },
    {
      image: assets.three,
      mobileImage: assets.main_banner_bg_sm3,
      tagline: "Weekly Specials You Can't Resist",
      buttonText: "View Deals"
    }
  ]

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000) // Change slide every 5 seconds
    return () => clearInterval(interval)
  }, [banners.length])

  return (
    <div className='relative w-full overflow-hidden'>
      {/* Slideshow container */}
      <div 
        className='flex transition-transform duration-1000 ease-in-out'
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={index} className='w-full flex-shrink-0 relative'>
            {/* Desktop/Large Screen Image */}
            <img 
              src={banner.image} 
              alt="banner" 
              className='w-full hidden md:block object-cover rounded-3xl' 
              style={{ maxHeight: '700px' }}
            />
            
            {/* Mobile Image */}
            <img 
              src={banner.mobileImage} 
              alt="banner" 
              className='w-full md:hidden object-cover'
            />

            {/* Content Overlay */}
            <div className='absolute inset-0 flex flex-col items-center md:items-end justify-end md:justify-center pb-16 md:pb-0 px-4 md:pr-12 lg:pr-20 xl:pr-28'>
              <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center md:text-right max-w-xs md:max-w-md lg:max-w-2xl xl:max-w-3xl leading-tight lg:leading-snug xl:leading-normal text-white drop-shadow-md'>
                {banner.tagline}
              </h1>
            
              <div className='flex items-center mt-6 md:mt-8 lg:mt-10 font-medium'>
                <Link 
                  to={"/products"} 
                  className='group flex items-center gap-2 px-6 md:px-8 lg:px-10 py-3 bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 rounded-lg text-white cursor-pointer shadow-lg hover:shadow-xl'
                >
                  {banner.buttonText}
                  <img 
                    className='md:hidden transition-transform group-hover:translate-x-1' 
                    src={assets.white_arrow_icon} 
                    alt="arrow" 
                  />
                </Link>

                <Link 
                  to={"/products"} 
                  className='group hidden md:flex items-center gap-2 ml-4 px-8 lg:px-10 py-3 bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-300 rounded-lg cursor-pointer shadow-lg hover:shadow-xl'
                >
                  Explore deals
                  <img 
                    className='transition-transform group-hover:translate-x-1' 
                    src={assets.black_arrow_icon} 
                    alt="arrow" 
                  />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide indicators only */}
      <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2'>
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-indigo-600' : 'bg-white bg-opacity-50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default MainBanner