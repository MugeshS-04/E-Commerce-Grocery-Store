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
    const [loadingCategories, setLoadingCategories] = useState(true);

    const { axios } = useAppContext();

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/categories');
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to load categories');
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, [axios]);

    const onSubmitHandler = async (event) => {
    try {
        event.preventDefault();

        // Basic validation
        if (!name || !description || !category || !price) {
            return toast.error('Please fill all required fields');
        }

        // Find the selected category to get its path
        const selectedCategory = categories.find(cat => cat._id === category);
        if (!selectedCategory) {
            return toast.error('Invalid category selected');
        }

        const productData = {
            name,
            description: description.split('\n'),
            category: selectedCategory.path, // Send the path instead of ID
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
            toast.success(data.message);
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
        console.error('Error adding product:', error);
        toast.error(error.response?.data?.message || 'Failed to add product');
    }
};
    const handleFileChange = (index, e) => {
        const updatedFiles = [...files];
        updatedFiles[index] = e.target.files[0];
        setFiles(updatedFiles);
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">
                {/* Product Images */}
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`} className="cursor-pointer">
                                <input
                                    onChange={(e) => handleFileChange(index, e)}
                                    type="file"
                                    id={`image${index}`}
                                    hidden
                                    accept="image/*"
                                />
                                <img
                                    className="max-w-24 h-24 object-cover border rounded"
                                    src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                                    alt="uploadArea"
                                />
                                {files[index] && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedFiles = [...files];
                                            updatedFiles[index] = null;
                                            setFiles(updatedFiles);
                                        }}
                                        className="text-xs text-red-500 mt-1"
                                    >
                                        Remove
                                    </button>
                                )}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Product Name */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">
                        Product Name
                    </label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        id="product-name"
                        type="text"
                        placeholder="Type here"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    />
                </div>

                {/* Product Description */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">
                        Product Description
                    </label>
                    <textarea
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        id="product-description"
                        rows={4}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                        placeholder="Type here"
                        required
                    ></textarea>
                </div>

                {/* Category Selection */}
                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">
                        Category
                    </label>
                    {loadingCategories ? (
                        <select disabled className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
                            <option>Loading categories...</option>
                        </select>
                    ) : (
                        <select
                            onChange={(e) => setCategory(e.target.value)}
                            value={category}
                            id="category"
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.text}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">
                            Product Price ($)
                        </label>
                        <input
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                            id="product-price"
                            type="number"
                            placeholder="0"
                            min="0"
                            step="0.01"
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                            required
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">
                            Offer Price ($)
                        </label>
                        <input
                            onChange={(e) => setOfferPrice(e.target.value)}
                            value={offerPrice}
                            id="offer-price"
                            type="number"
                            placeholder="0"
                            min="0"
                            step="0.01"
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer hover:bg-primary/90 transition-colors"
                >
                    ADD PRODUCT
                </button>
            </form>
        </div>
    );
};

export default AddProduct;