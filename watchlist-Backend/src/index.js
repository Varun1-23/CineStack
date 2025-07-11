import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import adminRoutes from './routes/admin.routes.js'
import movieRoutes from './routes/movie.routes.js'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import requestRoutes from './routes/request.routes.js'
import fs from 'fs';
import path from 'path';

dotenv.config()

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('📂 uploads folder created');
}

const app = express()
const PORT = process.env.PORT || 7000


// admin and user routes

app.use(cors({
    origin: ['http://localhost:5173', 'https://cine-stack-frontend.vercel.app', 'https://cine-stack-frontend-user.vercel.app'], // admin and user routes
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())

// sample route

app.get('/', (req , res) => {
    res.send('Movie API is running')
    
})

// admin routes

app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/movies', movieRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/requests', requestRoutes)

// connect mongoDB

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            
        })
    })
    .catch((err) => {
        console.error('MongoDB Connection error: ', err);
    })
