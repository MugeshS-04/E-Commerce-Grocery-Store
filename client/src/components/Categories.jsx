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
                <p className="text-2xl md:text-3xl font-medium">Categories</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6">
                    {Array(7).fill(0).map((_, index) => (
                        <div key={index} className="animate-pulse py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center bg-gray-200">
                            <div className="w-20 h-20 rounded-full bg-gray-300"></div>
                            <div className="h-4 w-16 bg-gray-300 rounded mt-2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-16">
                <p className="text-2xl md:text-3xl font-medium">Categories</p>
                <div className="mt-6 text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="mt-16">
            <p className="text-2xl md:text-3xl font-medium">Categories</p>
            {categories.length === 0 ? (
                <div className="mt-6 text-gray-500">No categories available</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category._id}
                            className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center hover:shadow-md transition-all"
                            style={{ backgroundColor: category.bgColor }}
                            onClick={() => {
                                navigate(`/products/${category.path.toLowerCase()}`);
                                window.scrollTo(0, 0);
                            }}
                        >
                            <img 
                                src={category.image} 
                                alt={category.text} 
                                className="group-hover:scale-105 transition-transform max-w-28 h-20 object-contain"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = assets.placeholder_image;
                                }}
                            />
                            <p className="text-sm font-medium text-center">{category.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Categories;