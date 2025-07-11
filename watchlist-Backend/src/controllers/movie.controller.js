import Movie from '../models/movie.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import fs from 'fs'

export const addMovie = asyncHandler (async (req, res) => {
    try {
        const { title , description , genre, language} = req.body
        if(!req.file){
            throw new ApiError(400 , "poster image is required")
        }

        const cloudinaryResult = await uploadOnCloudinary(req.file.path, 'movie-posters' )
        if(!cloudinaryResult){
            throw new ApiError(400 , "Failed to upload image")
        }

        const movie = await Movie.create({
            title,
            description,
            genre,
            language,
            posterUrl: cloudinaryResult.secure_url
        })

        return res
               .status(201)
               .json(new ApiResponse(201 , {movie} , 'message added successfully ')) 
    } catch (error) {
        console.error('errror adding movie:', error);
    }
})

export const getAllMovies = asyncHandler (async(req, res) => {
    const movies = await Movie.find().sort({ createdAt: -1 }) // latest one will come first
    return res
           .status(200)
           .json(new ApiResponse(200 , {movies} , "movies fetched")) 
})

export const updateMovie = asyncHandler(async (req , res) => {
    const movieId = req.params.id
    const { title, description, genre, language } = req.body

    const movie = await Movie.findById(movieId)
    if(!movie){
        throw new ApiError(404 , "Movie not found")
    }

    movie.title = title || movie.title
    movie.description = description || movie.description
    movie.genre = genre || movie.genre
    movie.language = language || movie.language

    if(req.file){
        const cloudinaryResult = await uploadOnCloudinary(req.file.path, 'movie-posters')
        if(!cloudinaryResult){
            throw new ApiError(400 , "Failed to upload image")
        }
        movie.posterUrl = cloudinaryResult.secure_url
    }
        await movie.save()

        if(req.file){
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            })
        }
        return res
               .status(200)
               .json(new ApiResponse(200 , {movie} , 'movie updated successfully'))

    
})

export const deleteMovie = asyncHandler(async (req, res) => {
    const movieId = req.params.id
    // console.log("🛠️ DELETE request received for movieId:", movieId);
    const movie = await Movie.findById(movieId)

    if(!movie){
        // console.log("❌ Movie not found for ID:", movie);
        throw new ApiError(404 , "Movie not found")
    }
    // console.log("🗑️ Deleting movie:", movie.title, movie._id);
    await Movie.deleteOne({ _id: movieId})
    return res
           .status(200)
           .json(new ApiResponse(200, null, "Movie deleted successfully")) 
})