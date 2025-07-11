import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
    {
        movieTitle: {
            type: String,
            required: true
        },
        userEmail: {
            type: String,
            required: true
        },
        dataSize: {
            type: String,
            required: true
        },
        requestedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model('Request', requestSchema);