import express from 'express';
import { loginUser, toggleLikeMovie } from '../controllers/user.controller.js';
import { logoutUser } from '../controllers/user.controller.js';
import { getUserProfile } from '../controllers/user.controller.js';
import { verifyUser } from '../middlewares/user.middleware.js';
import { getLikedMovies } from '../controllers/user.controller.js';


const router = express.Router()

router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/profile', verifyUser, getUserProfile)
router.post('/toggle-like/:movieId', verifyUser, toggleLikeMovie)
router.get('/liked-movies', verifyUser, getLikedMovies)

export default router