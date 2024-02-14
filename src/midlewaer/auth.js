// import  Jwt  from "jsonwebtoken";
import  Jwt  from "jsonwebtoken";
import { User } from "../models/user.models.js";

// Middleware to verify JWT token
export const verifyjwt = async (req, res, next) => {
   try {
     const token = req.cookies?.accessToken || req.headers['authorization'];
   
    //  console.log(token);
 
     if (!token) {
       return res.status(401).json({ message: 'Authorization token is required' });
     }
      
     const decoded = Jwt.verify(token,  process.env.ACCESS_TOKEN_SECRET)
 
     const user = await User.findById(decoded._id).select(" -password -refreshToken")
 
     if(!user) {
         res.status(401).json({ message: 'Invalid token'})
     }
    //  console.log(user);
     req.user = user
     next()
 
     // Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
     //     if (err) {
     //       if (err.name === 'TokenExpiredError') {
     //         return res.status(401).json({ message: 'Token has expired' });
     //       } else {
     //         return res.status(401).json({ message: 'Invalid token' });
     //       }
     //     }
     //     // console.log( decoded );
     //     req.user = decoded; // Attach the decoded user information to the request object
     //     next();
     //   });
 
 
   } catch (error) {
    console.log("auth error",error);
   }
  }

