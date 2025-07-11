import Admin from '../models/admin.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import {asyncHandler} from '../utils/asyncHandler.js'


export const adminLogin = asyncHandler(async(req , res , next) => {
    const {email , password} = req.body

    // console.log(email);
    // console.log(email);
    

    const admin = await Admin.findOne({ email })
    if(!admin){
        throw new ApiError(401 , 'Admin not found')
    }
    // console.log(admin);
    
    const isMatch = await bcrypt.compare(password , admin.password)

    if(!isMatch){
        throw new ApiError(401 , 'Invalid password')
    }

    const token = jwt.sign({
        id: admin._id ,
        role: 'admin'
    } , process.env.JWT_SECRET,
    {
        expiresIn: '1d'
    })

    res.cookie('adminToken' , token , {
        httpOnly: true ,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000 ,
    })

    return res
           .status(200)
           .json(new ApiResponse (200 , { role: 'admin'} , 'admin loggedin successfully')) 
})

export const adminLogout = asyncHandler(async (req, res) => {
    res.clearCookie("adminToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });

    return res
           .status(200)
           .json(new ApiResponse(200, null, "Admin logged out successfully"));
});
