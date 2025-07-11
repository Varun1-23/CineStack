import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const isProduction = process.env.NODE_ENV === "production";

export const loginUser = asyncHandler(async(req, res)=> {
    const { email , password} = req.body

    const user = await User.findOne({ email })
    // console.log(user);
    if(!user) {
        throw new ApiError(404, "user not found")
    }

    if(!user.isVerified){
        throw new ApiError(400, "user not verified")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new ApiError(400, "invalid password")
    }

    const token = jwt.sign({ userId: user._id,  role: 'user'}, process.env.JWT_SECRET,{
        expiresIn: '1d'
    })

    


    res.cookie('userToken' , token , {
        httpOnly: true ,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000 ,
    })

    return res
           .status(200)
           .json(new ApiResponse(200, {userId: user._id, email: user.email}, "Login successfull")) 
})

export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('adminToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
    })

    return res
           .status(200)
           .json(new ApiResponse(200 , null , "logged out successfully")) 
})

export const toggleLikeMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const user = await User.findById(req.user.userId)

    if(!user){
        throw new ApiError(404, "user not found")
    }

    const index = user.likedMovies.indexOf(movieId)

    if(index === -1 )
        {
                user.likedMovies.push(movieId)
                await user.save()
                return res
                    .status(200)
                    .json(new ApiResponse(200 , null , "Movie liked")) 
        }
        else{
            user.likedMovies.splice(index , 1)
            await user.save()
            return res
                   .status(200)
                   .json(new ApiResponse(200 , null , 'movie disliked')) 
        }   
})


export const getUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user.userId).populate('likedMovies')
    // console.log(user)
    if(!user){
        throw new ApiError(404, "user not found")
    }
    return res  
           .status(200)
           .json(new ApiResponse(200 , {user} , 'successfully fetched')) 
})

export const getLikedMovies = asyncHandler (async(req, res) => {
    const user = await User.findById(req.user.userId).populate('likedMovies')
    
    if(!user){
        throw new ApiError(404, "user not found")
    }

    return res
           .status(200)
           .json(new ApiResponse(200, user.likedMovies, "liked movies fetched")) 
})