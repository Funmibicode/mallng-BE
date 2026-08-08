import Product from "../models/ProductModel.js"
import User from "../models/UserModel.js"
import { v2 as cloudinary } from "cloudinary"



// @desc Get all products
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};


// @desc Get products by id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};


// @desc Get vendor products
const getVendorProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ user: req.user._id });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};



// @desc Create product with images
const postProducts = async (req, res, next) => {
  try {
    const { name, category, desc, price, imageUrls } = req.body; // 1. get imageUrls from body

    if (!name || !category || !desc || !price) {
      res.status(400);
      throw new Error("Please fill in all fields");
    }

    // 2. Handle uploaded files
    const uploadedImageUrls = req.files && req.files.length > 0 
      ? req.files.map((file) => file.path) 
      : [];
    const cloudinaryIds = req.files && req.files.length > 0 
      ? req.files.map((file) => file.filename) 
      : [];

    // 3. Handle pasted URLs
    const parsedImageUrls = imageUrls ? JSON.parse(imageUrls) : []; // turn string back to array

    // 4. Merge both together
    const allImageUrls = [...uploadedImageUrls, ...parsedImageUrls];

    if (allImageUrls.length === 0) {
      res.status(400);
      throw new Error("Please add at least one image");
    }

    // Auto-upgrade to vendor if user is posting a product
    if (req.user.role === "customer") {
        await User.findByIdAndUpdate(req.user._id, { role: "vendor" });
    }

    const product = await Product.create({
      name,
      category,
      desc,
      price,
      images: allImageUrls, // use merged array
      cloudinaryIds, // only files uploaded to cloudinary will have this
      user: req.user._id,
    });
      
    res.status(201).json({ msg: "Product added successfully", product });
  } catch (error) {
    next(error);
  }
};



// @desc Delete product and its Cloudinary images
const deleteProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Delete each image from Cloudinary first
    if (product.cloudinaryIds && product.cloudinaryIds.length > 0) {
      await Promise.all(
        product.cloudinaryIds.map((id) => cloudinary.uploader.destroy(id))
      );
    }

    // Then delete the product from MongoDB
    await product.deleteOne();

    res.status(200).json({ msg: "Product and images deleted successfully" });
  } catch (error) {
    next(error);
  }
};



// @desc Update product
const updateProducts = async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};



export { getProducts, getProductById, getVendorProducts, postProducts, deleteProducts, updateProducts };