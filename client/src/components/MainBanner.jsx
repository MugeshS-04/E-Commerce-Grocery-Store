import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div className='relative w-full'>
      {/* Desktop/Large Screen Image */}
      <img 
        src={assets.one} 
        alt="banner" 
        className='w-[100%] hidden md:block object-cover rounded-3xl' 
        style={{ maxHeight: '700px' }}
      />
      
      {/* Mobile Image */}
      <img 
        src={assets.main_banner_bg_sm} 
        alt="banner" 
        className='w-full md:hidden object-cover'
      />

      {/* Content Overlay - Now aligned to right */}
      <div className='absolute inset-0 flex flex-col items-center md:items-end justify-end md:justify-center pb-16 md:pb-0 px-4 md:pr-12 lg:pr-20 xl:pr-28'>
        {/* Heading with right alignment */}
        <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center md:text-right max-w-xs md:max-w-md lg:max-w-2xl xl:max-w-3xl leading-tight lg:leading-snug xl:leading-normal text-white drop-shadow-md'>
          Freshness You Can Trust, Savings You Will Love!
        </h1>
      
        {/* Buttons container - now right-aligned */}
        <div className='flex items-center mt-6 md:mt-8 lg:mt-10 font-medium'>
          {/* Primary CTA Button */}
          <Link 
            to={"/products"} 
            className='group flex items-center gap-2 px-6 md:px-8 lg:px-10 py-3 bg-primary hover:bg-primary-dull transition-all duration-300 rounded-lg text-white cursor-pointer shadow-lg hover:shadow-xl'
          >
            Shop now
            <img 
              className='md:hidden transition-transform group-hover:translate-x-1' 
              src={assets.white_arrow_icon} 
              alt="arrow" 
            />
          </Link>

          {/* Secondary CTA Button (hidden on mobile) */}
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
  )
}

export default MainBanner