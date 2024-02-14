// import { JsonWebTokenError } from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { asycHandler } from "../utils/asycHandler.js";
import { uploadOnCloudinary } from "../utils/clodinary.js";
import  Jwt  from "jsonwebtoken"; 

//----/**---- registerUser ----/**----
const registerUser = asycHandler(async (req, res) => {
  const { userName, email, password, fullName } = req.body;

  // Checking if any of the required fields are empty or only whitespace
  if (
    [userName, email, password, fullName].some((filde) => filde?.trim() === "")
  ) {
    // If any field is empty or contains only whitespace
    return res.status(400).json({ message: "All fields are required" });
  }
  const existedUser = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (existedUser) {
    // If a user with the provided email or username already exists
    console.error("User with the provided email or username already exists");
    return res.status(400).json({
      message: "User with the provided email or username already exists",
    });
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImgLocalPath = req.files?.coverImg[0]?.path;

  // Check if avatar local path is missing
  if (!avatarLocalPath) {
    throw new Error("Avatar local path is missing");
  }

  // Upload avatar and cover image to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImg = await uploadOnCloudinary(coverImgLocalPath);

  // Check if avatar upload failed
  if (!avatar) {
    return res.status(400).json({ error: "Avatar file upload failed" });
  }

  // Create a new user document
  const user = await User.create({
    userName: userName.toLowerCase(), // Corrected method invocation
    email,
    password,
    fullName,
    avatar: avatar.url,
    coverImg: coverImg?.url || "",
  });

  // Retrieve the created user document from the database
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); // Corrected field name
  if (!createdUser) {
    return res.status(500).json({ error: "User creation failed" }); // Corrected error message
  }

  // Respond with the created user object
  return res.status(201).json({ user: createdUser }); // Renamed key to 'user' for clarity
});



// ----/**---- generateAccessTokenAndRefreshToken ----/**----
const generateAccessTokenAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateReferenceToken(); // Corrected method name

  // Store the refresh token in the user document
  user.refreshToken = refreshToken

  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};



// ----/**---- loginUser ----/**----
const loginUser = asycHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ email: "email is required" });
  }

  const user = await User.findOne({ email });
console.log(password);
  if (!user) {
    return res.status(400).json({ user: "email does not exist" });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.status(401).json({ password: "wrong password" });
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loginUsers = await User.findById(user._id).select(
    " -password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({ accessToken, refreshToken, message: "User login successfully" });
    
});



// ----/**---- logOut User ----/**----
const logoutuser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true });
    
    const option = {
      httpOnly: true,
      secure: true
    }
    // Clear access token cookie
    res.clearCookie('accessToken', option);
    
    // Clear refresh token cookie
    res.clearCookie('refreshToken', option);

    return res.status(200).json({ message: 'Logout successful' });

    // function logoutuser(req, res) {
    //   // Perform logout actions such as removing the JWT token from client side
    //   res.status(200).json({ message: "Logged out successfully" });
    // }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



// ----/**---- refreshAccesToken ----/**----
const refreshAccesToken = asycHandler(async(req, res)=> {
  const incomingRefressToken =  req.cookies?.refreshToken  || req.body.refreshToken
  // cookies
  console.log(incomingRefressToken);

  if(!incomingRefressToken){
    return res.status(401).json({message: 'unAuthorized request'})
  }

  const decodeToken = Jwt.verify(incomingRefressToken, process.env.REFERENCE_TOKEN_SECRET)
  const user = await User.findById(decodeToken._id)

  console.log('users', user);
  if(!user){
    return res.status(401).json({message: 'invalid RefressToken'})

  }
  console.log(incomingRefressToken);
  console.log(user.refreshToken);

  if(incomingRefressToken !== user?.refreshToken){
    return res.status(401).json({message: ' RefressToken expire'})
  }

  const option = {
    httpOnly: true,
    secure: true
  }

  const { accessToken, refreshToken: newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id);

  return res.status(200)
  .cookie('accessToken', accessToken, option)
  .cookie('refreshToken', newRefreshToken, option)
  .json({ accessToken, refreshToken:newRefreshToken, message: "refresh Token created successfully "})

})



// ----/**---- changeCurrentPasword ----/**----
const changeCurrentPasword = asycHandler(async(req, res)=> {
  const {password, newPassword} = req.body
  // console.log(password);
  // console.log(newPassword);
  const userId = req.user._id;
  // console.log(userId);

   // Find the user by ID
   const user = await User.findById(userId)
  //  console.log(user);
   if(!user){
    return res.status(404).json({ message: 'User not found' });
   }
  //  console.log(user.password);
  //  console.log(password);
   // Check if the old password matches the user's current password
   const isPasswordValid = await user.isPasswordCorrect(password)
   if(!isPasswordValid){
    return res.status(400).json({ message: 'Invalid password' });
   }

  // Update the user's password with the new password
   user.password = newPassword;

     // Save the user document with the updated password
  await user.save({ validateBeforeSave: false });

    return res.status(200).json({ message: 'Password updated successfully' });


})




// ----/**----getCurrentUser ----/**----

const getCurrentUser = asycHandler(async(req, res)=> {
  const user = req.user
  return res.status(200).json({user, message:'Current user fetched successfully'})

  // return res.status(200).json({User:req.user, message:'current user fatch successfully'})
})


// ----/**---- updateAccountDetails   ----/**----

const updateAccountDetails = async(req, res)=> {
  const {fullName, email} = req.body
  console.log(`${fullName} and ${email}`);

  if (!fullName || !email) {
    return res.status(400).json('All fields are required');
  }
  const userId = req.user._id;
  console.log(userId);
  const user = await User.findByIdAndUpdate(userId,{$set:{fullName, email}},{new:true, select: '-password -refreshToken'})
  console.log(user);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Respond with updated user details
  res.status(200).json({user, message:'Account upDate successfully'}
  
  )
}
  


export { registerUser, loginUser, logoutuser, refreshAccesToken, changeCurrentPasword, getCurrentUser, updateAccountDetails };
