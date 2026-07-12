const User = require("../models/User");
const bcrypt = require("bcrypt");//we use it to hash password before storing it in the database
const jwt = require("jsonwebtoken");//it is a library that created and verifies jwt token we use it to create a token for the user after successful login

const registerUser = async (req, res) => {//why async bz mongo db take time to respond and we want to wait for it to respond before sending a response back to the client
    try {

        const { name, email, password } = req.body;//frontend  sends json express convert json to js object and we can access it using req.body

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const loginUser = async (req, res) => {
try{
    const {email,password}=req.body;
    const user=await User.findOne({email});//search for user in database with the given email in mongoose model
    if(!user){
        return res.status(400).json({
            message:"Invalid email or password"
        });
    }
    // Here you would typically compare the provided password with the hashed password stored in the database
    const isMatch=await bcrypt.compare(password,user.password);//why await bz searching monfodb takes
    if(!isMatch){
        return res.status(400).json({
            message:"Invalid email or password"
        });
    }
const token=jwt.sign(//creates an identity card
    {
        userId:user._id,//payload or information we want to include in the token
        role:user.role
    },
    process.env.JWT_SECRET,{//like iur own company stamp that we use to sign the token and verify it later
        expiresIn:"1h"//this id expires in 1 hour
    }
);
    res.status(200).json({
        message:"Login successful",
        token
    });
} catch(error){
    res.status(500).json({
        message:error.message
    })
   }
};
const getMe=async(req,res)=>{//when someone visit api/auth/me express will call getme
    try{
        const user=await User.findById(req.user.userId).select("-password");//send everything without password
        res.json(user);//express convert user into json browser recieve json so  it can display hii name) auto req.user.id already exixts when middleware uns to check jwt
    }
    catch(error){
        res.status(500).json({
            message:"Server error"
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe
};