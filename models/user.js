const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
 name:{
        type:String,  
        required:true
    }  ,
    email:{ 
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["customer","admin"],//bz mongodb allow everything allowed given values
        default:"customer"
    }
});
const User=mongoose.model("User",userSchema);
module.exports=User;       