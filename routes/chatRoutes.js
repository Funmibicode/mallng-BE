import { Router } from "express";
import {
  findOrCreateRoom,
  getRooms,
  getMessages,
  sendMessage, 
} from "../controllers/chatsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/room").post(protect, findOrCreateRoom);

router.route("/").get(protect, getRooms);

router.route("/:roomId").get(protect, getMessages);

// REST fallback + upload images via REST
router.route("/:roomId/message").post(protect, sendMessage);



export default router;