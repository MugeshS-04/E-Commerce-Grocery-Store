import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  text: { type: String, required: true },       // Display name of the category (e.g., "Veggies")
  path: { type: String, required: true },       // URL path (e.g., "Vegetables")
  image: { type: String, required: true },      // Image URL or base64
  bgColor: { type: String, required: true },    // Background color (e.g., "#FEF6DA")
}, { timestamps: true });

const Category = mongoose.models.category || mongoose.model('category', categorySchema);

export default Category;
