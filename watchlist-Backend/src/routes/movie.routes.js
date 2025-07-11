import express from 'express'
import multer from 'multer'
import path from 'path'
import { addMovie, deleteMovie, getAllMovies, updateMovie } from '../controllers/movie.controller.js'
import {verifyAdmin} from '../middlewares/auth.middleware.js'

const router = express.Router()

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})


const upload = multer({ storage })


router.post('/add', verifyAdmin, upload.single('poster'), addMovie)
router.get('/all', getAllMovies)
router.put('/:id', upload.single('poster'), updateMovie)
router.delete('/:id', deleteMovie)

export default router