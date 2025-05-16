import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const Categories = () => {
    const { navigate, axios } = useAppContext();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/categories');
                setCategories(data);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [axios]);

    if (loading) {
        return (
            <div className="mt-16">
                <p className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Shop Categories</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-6">
                    {Array(7).fill(0).map((_, index) => (
                        <div key={index} className="animate-pulse p-4 rounded-xl flex flex-col items-center bg-gray-100">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 mb-3"></div>
                            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-16">
                <p className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Shop Categories</p>
                <div className="flex items-center gap-2 mt-6 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-16">
            <p className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Shop Categories</p>
            {categories.length === 0 ? (
                <div className="flex items-center gap-2 mt-6 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                    </svg>
                    <span>No categories available</span>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-6">
                    {categories.map((category) => (
                        <div
                            key={category._id}
                            className="group cursor-pointer p-4 rounded-xl flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                            style={{ 
                                backgroundColor: category.bgColor,
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                            }}
                            onClick={() => {
                                navigate(`/products/${category.path.toLowerCase()}`);
                                window.scrollTo(0, 0);
                            }}
                        >
                            <div className="mb-3 p-2 bg-white/30 rounded-full">
                                <img 
                                    src={category.image} 
                                    alt={category.text} 
                                    className="group-hover:scale-110 transition-transform w-16 h-16 md:w-20 md:h-20 object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = assets.placeholder_image;
                                    }}
                                />
                            </div>
                            <p className="text-sm font-medium text-center text-gray-800 group-hover:text-primary">{category.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Categories;