import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const { axios } = useAppContext();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/categories');
                setCategories(data);
            } catch (error) {
                toast.error('Failed to load categories');
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, [axios]);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            if (!name || !description || !category || !price) {
                return toast.error('Please fill all required fields');
            }

            const selectedCategory = categories.find(cat => cat._id === category);
            if (!selectedCategory) {
                return toast.error('Invalid category selected');
            }

            const productData = {
                name,
                description: description.split('\n'),
                category: selectedCategory.path,
                price,
                offerPrice: offerPrice || price
            };

            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));
            
            files.forEach(file => {
                if (file) formData.append('images', file);
            });

            const { data } = await axios.post('/api/product/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                toast.success('Product added successfully!');
                // Reset form
                setName('');
                setDescription('');
                setCategory('');
                setPrice('');
                setOfferPrice('');
                setFiles([]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (index, e) => {
        const updatedFiles = [...files];
        updatedFiles[index] = e.target.files[0];
        setFiles(updatedFiles);
    };

    const removeImage = (index) => {
        const updatedFiles = [...files];
        updatedFiles[index] = null;
        setFiles(updatedFiles);
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">Add New Product</h2>
                    <p className="text-indigo-100">Fill in the details below to add a new product</p>
                </div>

                {/* Form */}
                <form onSubmit={onSubmitHandler} className="p-6 space-y-6">
                    {/* Product Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Images (Upload up to 4 images)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {Array(4).fill('').map((_, index) => (
                                <div key={index} className="relative">
                                    <label htmlFor={`image${index}`} className="block cursor-pointer">
                                        <input
                                            onChange={(e) => handleFileChange(index, e)}
                                            type="file"
                                            id={`image${index}`}
                                            hidden
                                            accept="image/*"
                                        />
                                        <div className={`h-32 rounded-lg border-2 border-dashed flex items-center justify-center ${files[index] ? 'border-gray-200' : 'border-indigo-300 bg-indigo-50'}`}>
                                            {files[index] ? (
                                                <img
                                                    src={URL.createObjectURL(files[index])}
                                                    alt="Preview"
                                                    className="h-full w-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="text-center p-4">
                                                    <img src={assets.upload_icon} alt="Upload" className="mx-auto h-10 w-10 text-indigo-400" />
                                                    <p className="mt-1 text-xs text-indigo-600">Click to upload</p>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                    {files[index] && (
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Name */}
                    <div>
                        <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="product-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter product name"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                            required
                        />
                    </div>

                    {/* Product Description */}
                    <div>
                        <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="product-description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter detailed product description"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500">Separate points with new lines</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            {loadingCategories ? (
                                <select 
                                    disabled 
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
                                >
                                    <option>Loading categories...</option>
                                </select>
                            ) : (
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.text}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Empty column to maintain layout */}
                        <div></div>

                        {/* Pricing */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                Price ($) <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="offer-price" className="block text-sm font-medium text-gray-700 mb-1">
                                Offer Price ($)
                            </label>
                            <input
                                id="offer-price"
                                type="number"
                                value={offerPrice}
                                onChange={(e) => setOfferPrice(e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding Product...
                                </>
                            ) : (
                                'Add Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;