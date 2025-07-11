import express from 'express';
import { adminLogin } from '../controllers/admin.controller.js';
import { adminLogout } from '../controllers/admin.controller.js';

const router = express.Router()

router.post('/login', adminLogin)
router.post('/logout', adminLogout)

export default router
