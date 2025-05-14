import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets'; // Make sure this import is correct

const AddCategory = () => {
    const [image, setImage] = useState(null);
    const [text, setText] = useState('');
    const [path, setPath] = useState('');
    const [bgColor, setBgColor] = useState('#FFFFFF');
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);

    const { axios } = useAppContext();

    // Function to construct proper image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return assets.upload_area; // Use your placeholder
        if (imagePath.startsWith('http')) return imagePath;
        return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${imagePath}`;
    };

    // Fetch categories on mount
    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('/api/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
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
            // Validation
            if (!text || !path || !bgColor) {
                setIsSubmitting(false);
                return toast.error('Text, path and background color are required');
            }
            if (!image) {
                setIsSubmitting(false);
                return toast.error('Category image is required');
            }

            const formData = new FormData();
            formData.append('text', text);
            formData.append('path', path);
            formData.append('bgColor', bgColor);
            formData.append('image', image);

            const { data } = await axios.post('/api/categories', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                }
            });

            toast.success('Category added successfully');
            // Reset form
            setText('');
            setPath('');
            setBgColor('#FFFFFF');
            setImage(null);
            fetchCategories();
        } catch (error) {
            console.error('Error adding category:', error);
            const errorMsg = error.response?.data?.message || 
                           error.response?.data?.error || 
                           'Failed to add category';
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }
            // Validate file size (e.g., 2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size should be less than 2MB');
                return;
            }
            setImage(file);
        }
    };

    const handleDelete = async (id) => {
        setIsDeleting(id);
        try {
            await axios.delete(`/api/categories/${id}`);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error(error.response?.data?.message || 'Failed to delete category');
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="flex-1 h-[95vh] overflow-y-auto flex flex-col gap-10 md:p-10 p-4">
            {/* FORM SECTION */}
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
                <h2 className="text-xl font-bold mb-6">Add New Category</h2>
                <form onSubmit={onSubmitHandler} className="space-y-6">
                    {/* IMAGE UPLOAD */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category Image
                        </label>
                        <div className="flex items-center gap-4">
                            <label htmlFor="categoryImage" className="cursor-pointer">
                                <input
                                    type="file"
                                    id="categoryImage"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <div className="w-32 h-32 rounded-md overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    {image ? (
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={assets.upload_area}
                                            alt="Upload area"
                                            className="w-full h-full object-contain p-2"
                                        />
                                    )}
                                </div>
                            </label>
                            {image && (
                                <button
                                    type="button"
                                    onClick={() => setImage(null)}
                                    className="text-red-500 text-sm hover:text-red-700"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Rest of your form inputs... */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Fresh Fruits"
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category Path
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., fruits"
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={path}
                                onChange={(e) => setPath(e.target.value)}
                                required
                            />
                        </div>
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
                                className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                            />
                            <span className="text-sm text-gray-600">{bgColor}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-3 rounded-md text-white font-medium ${isSubmitting ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}`}
                    >
                        {isSubmitting ? 'Adding...' : 'Add Category'}
                    </button>
                </form>
            </div>

            {/* EXISTING CATEGORIES SECTION */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Existing Categories</h2>
                {categories.length === 0 ? (
                    <p className="text-gray-500">No categories found. Add one above.</p>
                ) : (
                    <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
                        {categories.map((cat) => (
                            <div
                                key={cat._id}
                                className="p-5 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center gap-3"
                            >
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 shadow-inner">
                                    <img
                                        src={getImageUrl(cat.image)}
                                        alt={cat.text}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = assets.upload_area;
                                        }}
                                    />
                                    <div
                                        className="absolute inset-0 opacity-20"
                                        style={{ backgroundColor: cat.bgColor }}
                                    ></div>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-medium">{cat.text}</p>
                                    <span className="text-sm text-gray-500">/{cat.path}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-5 h-5 rounded-full border border-gray-200"
                                        style={{ backgroundColor: cat.bgColor }}
                                    ></div>
                                    <span className="text-xs text-gray-500">{cat.bgColor}</span>
                                </div>
                                <button
                                    onClick={() => handleDelete(cat._id)}
                                    disabled={isDeleting === cat._id}
                                    className={`mt-2 text-sm px-4 py-1 rounded-md ${isDeleting === cat._id ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors`}
                                >
                                    {isDeleting === cat._id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddCategory;