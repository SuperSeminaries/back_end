import multer from "multer"
import fs from 'fs'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // const uploadDir = 'public/temp'
    // // Check if the directory exists, if not, create it
    // if (!fs.existsSync(uploadDir)) {
    //   fs.mkdirSync(uploadDir, { recursive: true });
    // }
    // cb(null, uploadDir);
    cb(null, "public/temp")


  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)

     cb(null, file.originalname)
  }
})

export const upload = multer({ storage: storage })
