const express=require('express');
const router=express.Router();//this creates a mini express application
const{
    registerUser,
    loginUser,
    getMe
} = require('../controllers/authController');
const authMiddleware=require("../middleware/authMiddleware");
router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/me",authMiddleware,getMe); //someone req get/api/aith/me run authmiddle first it jwt is valid run getme send user detail
module.exports=router;

//routes never talk to mongo db
//routes never hash password
//route never creates user
//route simply map urls to function