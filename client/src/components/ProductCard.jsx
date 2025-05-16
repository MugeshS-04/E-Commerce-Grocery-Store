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
            className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 w-full max-w-xs"
        >
            {/* Product Image with Hover Effect */}
            <div className="group cursor-pointer relative h-48 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                <img 
                    className="group-hover:scale-110 transition-transform duration-300 max-h-full object-contain" 
                    src={product.image[0]} 
                    alt={product.name} 
                />
                {product.offerPrice < product.price && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        SALE
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="p-4">
                <p className="text-xs uppercase text-gray-500 mb-1">{product.category}</p>
                <h3 className="text-gray-800 font-medium text-lg mb-2 line-clamp-2 h-14">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                        {Array(5).fill('').map((_, i) => (
                            <img 
                                key={i} 
                                className="w-4" 
                                src={i < 4 ? assets.star_icon : assets.star_dull_icon} 
                                alt=""
                            />
                        ))}
                    </div>
                    <span className="text-gray-500 text-sm">(4)</span>
                </div>

                {/* Price and Add to Cart */}
                <div className="flex items-end justify-between mt-4">
                    <div>
                        <p className="text-xl font-bold text-primary">
                            {currency}{product.offerPrice}
                        </p>
                        {product.offerPrice < product.price && (
                            <p className="text-gray-400 text-sm line-through">
                                {currency}{product.price}
                            </p>
                        )}
                    </div>

                    <div onClick={(e) => e.stopPropagation()} className="text-primary">
                        {!cartItems[product._id] ? (
                            <button 
                                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dull text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                                onClick={() => addToCart(product._id)}
                            >
                                <img src={assets.cart_icon} alt="cart" className="w-4" />
                                <span>Add</span>
                            </button>
                        ) : (
                            <div className="flex items-center justify-between gap-3 bg-primary/10 rounded-lg px-3 py-2 border border-primary/20">
                                <button 
                                    onClick={() => removeFromCart(product._id)} 
                                    className="text-primary hover:text-primary-dull text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-primary/20 transition-colors"
                                >
                                    -
                                </button>
                                <span className="font-medium text-gray-800 min-w-5 text-center">
                                    {cartItems[product._id]}
                                </span>
                                <button 
                                    onClick={() => addToCart(product._id)} 
                                    className="text-primary hover:text-primary-dull text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-primary/20 transition-colors"
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