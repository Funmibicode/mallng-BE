import express from "express"
import {
  getProducts,
  getProductById,
  getVendorProducts,
  postProducts,
  updateProducts,
  deleteProducts,
} from "../controllers/productsController.js"
import {protect} from "../middleware/authMiddleware.js"
import upload from "../uploads/upload.js"
import { productSchema, validate } from "../utils/validation.js"

const router = express.Router();


router.route("/").get(getProducts);
router.route("/create").post(protect, upload.array("images", 5), validate(productSchema), postProducts);

router.route("/my-products").get(protect, getVendorProducts);


router.route("/:id")
 .get(getProductById) 
 .put(protect, updateProducts)
 .delete(protect, deleteProducts);

export default router;