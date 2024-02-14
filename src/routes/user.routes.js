import { Router } from "express";
import { changeCurrentPasword, getCurrentUser, loginUser, logoutuser, refreshAccesToken, registerUser, updateAccountDetails } from "../controllers/user.controllers.js";
import { upload } from "../midlewaer/multer.js";
import { verifyjwt } from "../midlewaer/auth.js";

const router = Router();

router.route('/register').post(upload.fields([
    { name: 'avatar', maxCount: 1 }, // Using the string 'avatar' directly
    { name: 'coverImg', maxCount: 1 } // Using the string 'coverImg' directly
]
),registerUser)

router.route('/login').post(loginUser)
router.route('/logOut').post(verifyjwt, logoutuser)
router.route('/refreshToken').post(refreshAccesToken)
router.route('/password').post(verifyjwt, changeCurrentPasword)
router.route('/currentUser').post(verifyjwt, getCurrentUser)
router.route('/upDateUser').patch(verifyjwt, updateAccountDetails)

export default  router 