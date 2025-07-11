import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    genre: String,
    language: {
        type: String,
        required: true
    },
    posterUrl: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
})

export default mongoose.model('Movie', movieSchema)


