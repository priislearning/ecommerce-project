const express=require('express');
const router=express.Router();//this creates a mini express application
const{
    registerUser,
    loginUser,
    getMe
} = require('../controllers/authController');
const authMiddleware=require("../middleware/authMiddleware");
const { registerValidation } = require("../validators/authValidator");
const validate = require("../middleware/validate");
console.log(registerValidation);
console.log(validate);
router.post("/register",registerValidation,validate,registerUser);//middleware executes left to right order matter
router.post("/login",loginUser);
router.get("/me",authMiddleware,getMe); //someone req get/api/aith/me run authmiddle first it jwt is valid run getme send user detail
module.exports=router;

//routes never talk to mongo db
//routes never hash password
//route never creates user
//route simply map urls to function