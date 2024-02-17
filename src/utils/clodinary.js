import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; // Fixed import syntax
import dotenv from "dotenv";
dotenv.config();

// Cloudinary configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});

// Function to upload file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("File is uploaded on Cloudinary", response.url);

        // Delete local file after successful upload
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        if (fs.existsSync(localFilePath)) {
            // Delete local file if it exists
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};


export  {uploadOnCloudinary}