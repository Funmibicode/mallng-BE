import { Router } from "express";
import {
  findOrCreateRoom,
  getRooms,
  getMessages,
} from "../controllers/chatsController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = Router();

router.route("/room").post(protect, findOrCreateRoom);

router.route("/").get(protect, getRooms);

router.route("/:roomId").get(protect, getMessages);


export default router;