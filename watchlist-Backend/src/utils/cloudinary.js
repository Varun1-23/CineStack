import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config()

//CONFIGURE CLOUDINARY
cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

const uploadOnCloudinary = async (localFilePath , folder = "") => {
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(
            localFilePath,{
                resource_type: 'auto',
                 folder: folder
            }
        )
        console.log("File uploaded on cloudinary. File src: ", response.url);
        // after uploading the file, we can delete it from the local storage
        await fs.unlink(localFilePath);
        return response
    } catch (error) {
        console.log("Error on Cloudinary ", error);
        fs.unlinkSync(localFilePath)
        return null
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
       const result = await cloudinary.uploader.destroy(publicId)
        console.log("Deleted from cloudinary. Public id ", publicId);
        
        }
     catch (error) {
        console.log("error deleting from cloudinary", error);
        return null;
    }
}

export {uploadOnCloudinary , deleteFromCloudinary};