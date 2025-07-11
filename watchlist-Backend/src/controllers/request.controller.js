import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import Request from '../models/request.model.js'



export const createRequest = asyncHandler(async (req, res) => {
    const { userEmail , movieTitle ,  dataSize } = req.body
    console.log("➡️ Incoming request data:", req.body);
    
    if(!movieTitle || !userEmail || !dataSize){
        throw new ApiError(400, 'All fields are required')
    }

    const request = await Request.create({
        movieTitle ,
        userEmail ,
        dataSize ,
    })

    return res
           .status(201)
           .json(new ApiResponse(201 , {request}, 'Request submitted successfully')) 
})


export const getAllRequests = asyncHandler(async(req, res) => {
    const requests = await Request.find().sort({
        createdAt: -1
    })

    return res
           .status(200)
           .json(new ApiResponse(200, { requests } , 'fetched all requests')) 
})

export const deleteRequest = asyncHandler (async (req, res) => {
    const { id } = req.params
    const request= await Request.findByIdAndDelete(id)

   if(!request){
    throw new ApiError(404, 'Request not found')
   }

   return res
          .status(200)
          .json(new ApiResponse(200 , {request} , "Request Deleted"))  
})

export const getRequestsByUser = asyncHandler(async(req, res) => {
    const { email} = req.params

    if(!email){
        throw new ApiError(400, 'Email is required')
    }

    const userRequests = await Request.find({ userEmail: email})

    return res
           .status(200)
           .json(new ApiResponse(200, {requests: userRequests} , "fetched successfully")) 
})