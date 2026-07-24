import express from "express"
import {
  initializePayment, verifyPayment, paystackWebhook,
} from "../controllers/paymentsController.js"
import {protect} from "../middleware/authMiddleware.js"



const router = express.Router();



router.route("/initialize").post(protect, initializePayment);

router.route("/verify").get(verifyPayment);

router.route("/webhook").post(paystackWebhook);

             
             
             
export default router;