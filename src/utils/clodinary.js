import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; // Fixed import syntax

// Cloudinary configuration
cloudinary.config({ 
    cloud_name: 'dfqfw94un', 
    api_key: '292939424399789', 
    api_secret: 'CC_m2ue7XJJ-JdcDeWwLqGV4k2s' 
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