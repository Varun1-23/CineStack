import { User } from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res)=> {
    try {
        const { username , email , password } = req.body;

        const existing = await User.findOne({ email });
        if (existing && existing.isVerified) {
            throw new ApiError(400, "Email already exists");
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
        console.log(otpCode);
        const expires = new Date(Date.now() + 10 * 60 * 1000)

        await Otp.create({ email, otp: otpCode, expiresAt: expires });

        await sendEmail(email, 'Verify your OTP', `Your OTP is: ${otpCode}`)

        return res
               .status(201)
               .json(new ApiResponse(201 , {email} , 'Otp send to email' )) 
    } catch (error) {
     console.error(error);
     throw new ApiError(500, 'registration failed')
    }
})

export const verifyOtp = asyncHandler(async(req, res) => {
    try {
        const { email, otp , username , password } = req.body

        const record = await Otp.findOne({ email, otp })
        if(!record){
            throw new ApiError(400, 'Invalid OTP')
        }

        if(record.expiresAt < new Date())
        {
            throw new ApiError(400, 'OTP expired')
        }

         const existing = await User.findOne({ email });
         if (existing) {
         throw new ApiError(400, "Email already verified");
         }

        
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashed, isVerified: true });

        await Otp.deleteOne({ email, otp})

        console.log(email);
        console.log(otp);
        console.log(username);
        
        return res
               .status(200)
               .json(new ApiResponse(200 , {userId: user._id, email: user.email, username: user.username} , "Email verified and user registered Successfully")) 
         
    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'OTP verification failed')
    }
})