import express from "express";
import {
  createOrder,
  getMyOrders,
  getVendorOrders,
  getOrderById,
  updateOrderStatus,
  confirmDelivery,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();




router.route("/").post(protect, createOrder);
router.route("/my-orders").get(protect, getMyOrders);
router.route("/vendor-orders").get(protect, getVendorOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/ship").put(protect, updateOrderStatus);
router.route("/:id/confirm").put(protect, confirmDelivery);


export default router;