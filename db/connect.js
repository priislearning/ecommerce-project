const mongoose = require('mongoose');
async function connectDB(uri){
    try{
       await mongoose.connect(uri || process.env.MONGO_URI);
        console.log("MongoDB connected");
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
}
module.exports=connectDB;