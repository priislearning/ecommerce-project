require("dotenv").config();
require("./config/env.js");
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");
const connectDB=require("./db/connect.js");
const authRoutes=require("./routes/authRoutes.js");
const Product=require("./models/product.js");
const products = require("./data/products");
const express=require('express');
const helmet=require("helmet");
const cors=require("cors");
const orderRoutes = require("./routes/orderRoutes");
const path=require('path');
const {
    connectRedis
}=require("./db/redis.js");
const app=express();// create an express application
app.use(helmet({
    contentSecurityPolicy: false
}));//add security headers to response
app.use(cors());
app.use(express.json());//parse json from req
//nosql injection anything begg with $ is sus it remove it all dang operator start with $ it also sanitize .
app.use(express.static(path.join(__dirname,"client"))); // serve static files from public folder
const port=3000;
app.use('/api/auth', authRoutes); // Use the authentication routes
 // Protect the products route
 app.use("/api/products", productRoutes);
 app.use("/api/cart", cartRoutes);
 app.use("/api/orders", orderRoutes);
async function seedProducts(){
    const count=await Product.countDocuments();
    if(count==0){
        await Product.insertMany(products);
        console.log("product inserted into MongoDB");
    }
    else{
        console.log("products already exist in MongoDB")
    }
}
async function start(){//await tells js dont move to the next line until this operation finish
    await connectDB();//start server connect mongo db wait.. mongodb connected
    await connectRedis();//connect redis wait... redis connected
    await seedProducts();//seed products start express server
    app.listen(port,()=>{//server start listening on port 3000
        console.log(`server is running on port ${port}`);
    });
}
start();