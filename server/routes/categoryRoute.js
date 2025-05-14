import express from "express";
import multer from "multer";
import { getCategories, addCategory, deleteCategory } from "../controllers/CategoryController.js";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/categories');
    // Ensure directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const categoryRouter = express.Router();

// Routes
categoryRouter.get('/', getCategories);
categoryRouter.post('/', upload.single('image'), addCategory);  // Add multer middleware here
categoryRouter.delete('/:id', deleteCategory);

export default categoryRouter;
