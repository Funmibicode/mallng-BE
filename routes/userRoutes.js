import { Router } from "express"
import { registerUser, logInUser, logoutUser, getUser } from "../controllers/userController.js"
import {protect} from "../middleware/authMiddleware.js"
import { registerSchema, loginSchema, validate } from "../utils/validation.js"



const router = Router();



router.route('/register').post(validate(registerSchema), registerUser);

router.route('/login').post(validate(loginSchema), logInUser);

router.route('/logout').post(logoutUser);

router.route('/profile').get(protect, getUser);




export default router;