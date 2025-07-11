import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

export const verifyAdmin = (req, res , next) => {

    const token = req.cookies?.adminToken
    if(!token) {
        throw new ApiError(401, 'unauthorized token')
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(decoded.role !== 'admin'){
            throw new ApiError(403, "Forbidden: Not an admin")
        }
        
        req.user = decoded
        next()
    } catch (error) {
        throw new ApiError(401 , 'Invalid token')
    }
}