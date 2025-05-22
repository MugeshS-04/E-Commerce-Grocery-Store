import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

const ProductDetails = () => {
    const { products, navigate, currency, addToCart, cartItems } = useAppContext();
    const { id } = useParams();
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const product = products.find((item) => item._id === id);

    useEffect(() => {
        if (products.length > 0 && product) {
            let productsCopy = [...products];
            productsCopy = productsCopy.filter(
                (item) => product.category === item.category && item._id !== product._id
            );
            setRelatedProducts(productsCopy.slice(0, 5));
        }
    }, [products, product]);

    useEffect(() => {
        if (product?.image?.length > 0) {
            setThumbnail(product.image[0]);
        }
    }, [product]);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product._id);
        }
        toast.success(`${quantity} ${product.name} added to cart`);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate("/cart");
    };

    if (!product) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumbs */}
            <nav className="flex text-sm text-gray-600 mb-8">
                <Link to="/" className="hover:text-indigo-600">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/products" className="hover:text-indigo-600">Products</Link>
                <span className="mx-2">/</span>
                <Link 
                    to={`/products/${product.category.toLowerCase()}`} 
                    className="hover:text-indigo-600 capitalize"
                >
                    {product.category}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-indigo-600 font-medium">{product.name}</span>
            </nav>

            {/* Product Main Section */}
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Product Images */}
                <div className="lg:w-1/2">
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                        <div className="h-96 w-full flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden mb-4">
                            <img 
                                src={thumbnail || assets.placeholder} 
                                alt={product.name} 
                                className="h-full object-contain mix-blend-multiply"
                            />
                        </div>
                        <div className="flex gap-3">
                            {product.image.map((image, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => setThumbnail(image)} 
                                    className={`w-16 h-16 border rounded-lg overflow-hidden cursor-pointer transition-all ${thumbnail === image ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'}`}
                                >
                                    <img 
                                        src={image} 
                                        alt={`Thumbnail ${index + 1}`} 
                                        className="h-full w-full object-contain bg-gray-50"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product Info */}
                <div className="lg:w-1/2">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                        
                        {/* Rating */}
                        <div className="flex items-center mt-3">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className={`w-5 h-5 ${star <= 4 ? 'text-amber-400' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm ml-2">(24 reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="mt-6">
                            {product.offerPrice < product.price && (
                                <p className="text-gray-400 text-sm line-through">
                                    MRP: {currency}{product.price}
                                </p>
                            )}
                            <p className="text-3xl font-bold text-indigo-600">
                                {currency}{product.offerPrice}
                            </p>
                            <p className="text-green-600 text-sm mt-1">
                                {product.offerPrice < product.price && 
                                    `You save ${currency}${(product.price - product.offerPrice).toFixed(2)} (${Math.round(100 - (product.offerPrice / product.price * 100))}%)`
                                }
                            </p>
                            <p className="text-gray-500 text-sm mt-1">Inclusive of all taxes</p>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Details</h3>
                            <ul className="space-y-2 text-gray-600">
                                {product.description.map((desc, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {desc}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Buttons */}
                        <div className="mt-8 flex gap-4">
                            <button 
                                onClick={handleAddToCart}
                                className="flex-1 py-3 px-6 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Add to Cart
                            </button>
                            <button 
                                onClick={handleBuyNow}
                                className="flex-1 py-3 px-6 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            <div className="mt-20">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-800">You May Also Like</h2>
                    <div className="w-20 h-1 bg-indigo-600 rounded-full mx-auto mt-2"></div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {relatedProducts.filter(product => product.inStock).map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>

                <div className="text-center mt-10">
                    <button 
                        onClick={() => { navigate('/products'); window.scrollTo(0, 0); }}
                        className="inline-flex items-center px-6 py-3 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                        View All Products
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;