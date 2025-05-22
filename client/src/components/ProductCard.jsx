import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
    const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

    return product && (
        <div 
            onClick={() => { 
                navigate(`/products/${product.category.toLowerCase()}/${product._id}`); 
                window.scrollTo(0, 0); 
            }} 
            className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 w-full max-w-xs group"
        >
            {/* Product Image with Hover Effect */}
            <div className="relative h-48 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                <img 
                    className="group-hover:scale-105 transition-transform duration-300 max-h-full object-contain mix-blend-multiply" 
                    src={product.image[0]} 
                    alt={product.name} 
                />
                {product.offerPrice < product.price && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-md shadow-sm">
                        {Math.round(100 - (product.offerPrice / product.price * 100))}% OFF
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="p-4">
                <p className="text-xs uppercase text-indigo-500/80 font-medium mb-1 tracking-wider">
                    {product.category}
                </p>
                <h3 className="text-gray-800 font-medium text-lg mb-2 line-clamp-2 h-14 leading-tight">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg 
                                key={star}
                                className={`w-4 h-4 ${star <= 4 ? 'text-amber-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-gray-400 text-sm">(24)</span>
                </div>

                {/* Price and Add to Cart */}
                <div className="flex items-end justify-between mt-4">
                    <div>
                        <p className="text-xl font-semibold text-indigo-600">
                            {currency}{product.offerPrice}
                        </p>
                        {product.offerPrice < product.price && (
                            <p className="text-gray-400 text-sm line-through mt-0.5">
                                {currency}{product.price}
                            </p>
                        )}
                    </div>

                    <div onClick={(e) => e.stopPropagation()} className="text-indigo-600">
                        {!cartItems[product._id] ? (
                            <button 
                                className="flex items-center justify-center gap-2 bg-indigo-600/90 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                                onClick={() => addToCart(product._id)}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="font-medium">Add</span>
                            </button>
                        ) : (
                            <div className="flex items-center justify-between gap-3 bg-indigo-100/50 rounded-lg px-3 py-1.5 border border-indigo-200/50">
                                <button 
                                    onClick={() => removeFromCart(product._id)} 
                                    className="text-indigo-200 hover:text-indigo-800 text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-indigo-200/50 transition-colors"
                                >
                                    -
                                </button>
                                <span className="font-medium text-indigo-700 min-w-5 text-center">
                                    {cartItems[product._id]}
                                </span>
                                <button 
                                    onClick={() => addToCart(product._id)} 
                                    className="text-indigo-200 hover:text-indigo-800 text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-indigo-200/50 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;