import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const AddCategory = () => {
    const [image, setImage] = useState(null);
    const [text, setText] = useState('');
    const [path, setPath] = useState('');
    const [bgColor, setBgColor] = useState('#6366F1'); // Default indigo-500
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);

    const { axios } = useAppContext();

    const getImageUrl = (imagePath) => {
        if (!imagePath) return assets.upload_area;
        if (imagePath.startsWith('http')) return imagePath;
        return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${imagePath}`;
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('/api/categories');
            setCategories(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch categories');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            if (!text || !path) {
                return toast.error('Category name and path are required');
            }
            if (!image) {
                return toast.error('Category image is required');
            }

            const formData = new FormData();
            formData.append('text', text);
            formData.append('path', path);
            formData.append('bgColor', bgColor);
            formData.append('image', image);

            const { data } = await axios.post('/api/categories', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Category added successfully');
            setText('');
            setPath('');
            setBgColor('#6366F1');
            setImage(null);
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add category');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size should be less than 2MB');
                return;
            }
            setImage(file);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        
        setIsDeleting(id);
        try {
            await axios.delete(`/api/categories/${id}`);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                {/* Add Category Form */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-8">
                    <div className="bg-indigo-600 px-6 py-4">
                        <h2 className="text-xl font-bold text-white">Add New Category</h2>
                        <p className="text-indigo-100">Create a new product category</p>
                    </div>

                    <form onSubmit={onSubmitHandler} className="p-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Image <span className="text-red-500">*</span>
                                </label>
                                <label htmlFor="categoryImage" className="block cursor-pointer">
                                    <input
                                        type="file"
                                        id="categoryImage"
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <div className={`h-48 rounded-lg border-2 border-dashed flex items-center justify-center ${image ? 'border-gray-200' : 'border-indigo-300 bg-indigo-50'}`}>
                                        {image ? (
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt="Preview"
                                                className="h-full w-full object-contain p-4"
                                            />
                                        ) : (
                                            <div className="text-center p-4">
                                                <img src={assets.upload_icon} alt="Upload" className="mx-auto h-10 w-10 text-indigo-400" />
                                                <p className="mt-2 text-sm text-indigo-600">Click to upload image</p>
                                                <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                                            </div>
                                        )}
                                    </div>
                                </label>
                                {image && (
                                    <button
                                        type="button"
                                        onClick={() => setImage(null)}
                                        className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                                    >
                                        Remove Image
                                    </button>
                                )}
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Fresh Fruits"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category Path <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. fruits"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                                        value={path}
                                        onChange={(e) => setPath(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Background Color
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="color"
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                            className="w-12 h-12 rounded-md border border-gray-300 cursor-pointer shadow-sm"
                                        />
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={bgColor}
                                                readOnly
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Adding Category...
                                    </>
                                ) : 'Add Category'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Existing Categories */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="bg-indigo-600 px-6 py-4">
                        <h2 className="text-xl font-bold text-white">Existing Categories</h2>
                        <p className="text-indigo-100">{categories.length} categories available</p>
                    </div>

                    <div className="p-6">
                        {categories.length === 0 ? (
                            <div className="text-center py-8">
                                <img src={assets.empty_icon} alt="Empty" className="mx-auto h-16 w-16 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
                                <p className="mt-1 text-sm text-gray-500">Add your first category using the form above</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categories.map((cat) => (
                                    <div key={cat._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                        <div 
                                            className="h-32 w-full flex items-center justify-center"
                                            style={{ backgroundColor: cat.bgColor }}
                                        >
                                            <img
                                                src={getImageUrl(cat.image)}
                                                alt={cat.text}
                                                className="max-h-20 max-w-full object-contain"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = assets.upload_area;
                                                }}
                                            />
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">{cat.text}</h3>
                                                    <p className="text-sm text-gray-500">/{cat.path}</p>
                                                </div>
                                                <div 
                                                    className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                                                    style={{ backgroundColor: cat.bgColor }}
                                                    title={cat.bgColor}
                                                ></div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(cat._id)}
                                                disabled={isDeleting === cat._id}
                                                className={`mt-4 w-full py-2 text-sm font-medium rounded-md ${isDeleting === cat._id ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'} transition-colors`}
                                            >
                                                {isDeleting === cat._id ? 'Deleting...' : 'Delete Category'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCategory;