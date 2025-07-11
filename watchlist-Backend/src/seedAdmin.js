import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Admin from './models/admin.model.js';

dotenv.config()

 const createAdmin = async () => {
    await mongoose.connect(process.env.MONGODB_URL)

    const existingAdmin = await Admin.findOne({ email : process.env.ADMIN_EMAIL})
    if(existingAdmin)
    {
        console.log("Admin exists");
        return process.exit(0)
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

    await Admin.create({
        username: "admin",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin'
    })

    console.log("Admin created successfully");
    process.exit(0)
    

}

createAdmin()


