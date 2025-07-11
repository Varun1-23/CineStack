import express from 'express';
import { createRequest, deleteRequest } from '../controllers/request.controller.js';
import { getAllRequests } from '../controllers/request.controller.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';
import { getRequestsByUser } from '../controllers/request.controller.js';


const router = express.Router()

router.post('/create', createRequest)
router.get('/all', verifyAdmin, getAllRequests)
router.delete('/delete/:id', verifyAdmin, deleteRequest)
router.get('/user/:email', getRequestsByUser)

export default router