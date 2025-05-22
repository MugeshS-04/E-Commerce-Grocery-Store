import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
    const { products } = useAppContext();
    
    // Filter in-stock products and take first 10
    const bestSellers = products.filter((product) => product.inStock).slice(0, 10);
    
    // Split into two rows of 5 products each
    const topProducts = bestSellers.slice(0, 5);
    const bottomProducts = bestSellers.slice(5, 10);

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
      
      {/* Top Row - First 5 Products */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6'>
        {topProducts.map((product, index) => (
          <ProductCard key={index} product={product}/>
        ))}
      </div>
      
      {/* Bottom Row - Next 5 Products */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-8'>
        {bottomProducts.map((product, index) => (
          <ProductCard key={index} product={product}/>
        ))}
      </div>
    </div>
  )
}

export default BestSeller