import { Router } from "express";
import {
  getCategories,
  createCategories,
  updateCategories,
  deleteCategories,
} from "../controllers/categoryController.js";
import { protect, authorize } from "../middleware/authMiddleware.js"




const router = Router();



router.route("/").get(getCategories).post(protect, authorize("admin"), createCategories);


router.route("/:id").put(protect, authorize("admin"), updateCategories).delete(protect, authorize("admin"), deleteCategories);



export default router;