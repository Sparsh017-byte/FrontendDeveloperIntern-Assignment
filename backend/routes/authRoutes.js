import express from 'express'
import { registerUser,loginUser,logout,getMe,changeUserName } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';


const router = express.Router();


router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',logout);
router.get('/me',protect,getMe);
router.patch('/me',protect,changeUserName);

export default router;