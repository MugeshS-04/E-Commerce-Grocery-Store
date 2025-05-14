import { v2 as cloudinary } from "cloudinary";
import Category from "../models/Category.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories); // Directly return the array
  } catch (err) {
    res.status(500).json([]); // Return empty array on error
  }
};

// @desc    Add a new category
// @route   POST /api/categories
// @access  Admin
export const addCategory = async (req, res) => {
  try {
    const { text, path, bgColor } = req.body;
    const image = req.file;

    // Validation
    if (!text || !path || !bgColor) {
      return res.status(400).json({ 
        success: false,
        message: "Text, path and background color are required"
      });
    }

    if (!image) {
      return res.status(400).json({ 
        success: false,
        message: "Category image is required" 
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image.path, {
      folder: 'categories',
      resource_type: 'auto'
    });

    const newCategory = new Category({
      text,
      path,
      image: result.secure_url, // Use Cloudinary URL
      bgColor
    });

    const savedCategory = await newCategory.save();
    
    res.status(201).json(savedCategory); // Return the saved category directly

  } catch (err) {
    console.error('Error in addCategory:', err);
    res.status(500).json({
      message: "Server error while adding category",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Delete a category by ID
// @route   DELETE /api/categories/:id
// @access  Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete from Cloudinary if image exists
    if (category.image) {
      const publicId = category.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`categories/${publicId}`);
    }

    await Category.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ 
      message: "Error deleting category",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};