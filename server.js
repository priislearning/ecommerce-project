require("dotenv").config();
require("./config/env");
const Cart=require("./models/Cart.js");
const connectDB=require("./db/connect.js");
const authMiddleware=require("./middleware/authMiddleware.js");
const jwt=require("jsonwebtoken");
const authRoutes=require("./routes/authRoutes.js");
const Product=require("./models/Product.js");
const express=require('express');
const helmet=require("helmet");
const cors=require("cors");
const path=require('path');
const {
    connectRedis,
    redisClient//we need this to get() and set() inside out api
}=require("./db/redis.js");
const app=express();// create an express application
app.use(helmet());//add security headers to response
app.use(cors());
app.use(express.json());//parse json from req

app.use(express.static(path.join(__dirname,"client"))); // serve static files from public folder
const port=3000;
app.use('/api/auth', authRoutes); // Use the authentication routes
 // Protect the products route
app.get('/api/products',async(req,res)=>{ // handles a get request
    try{
        const cachedProducts=await redisClient.get("products");//redis store data like key value
        if(cachedProducts){
            console.log("Cache Hit");
            return res.json(JSON.parse(cachedProducts));//redis store string before sending it back we convert it into js object again
        }
        console.log("Cache miss");
        const products=await Product.find();//if not in redis find in mongodb
        await redisClient.set("products",JSON.stringify(products));//mongodb give object redis want string
        res.json(products);
    }
    catch(error){
        res.status(500).json({message:"Server error"});
    }
});
app.post("/api/cart",authMiddleware, async(req,res)=>{//browser post/api/cart auth jwt verified,route start
    try{
    const userId=req.user.userId;
    const cartKey=`cart:${userId}`;//this becomes redis key
    const { id:productId }=req.body;//express convert json to js object this is product id
    const product = await Product.findById(productId)
    if(!product){
        return res.status(404).json({
            message:"Product not found"
        });
    }
    let cart=await Cart.findOne({user:userId});//this is mongodb
    if(!cart){
        cart=new Cart({
            user:userId,
            items:[]
        });
    }
    const existingItem=cart.items.find(item=>item.productId.toString()===productId);
    if(existingItem){
        existingItem.quantity++;
    }else{
        cart.items.push({
            productId:product._id,
            name:product.name,
            price:product.price,
            quantity:1
        });
    }
    await cart.save();//saved to mongodb before this evrrythig=ng was js object
     await redisClient.del(cartKey);

    res.status(201).json({
        message: "Product added",
        cart: cart.items
    });
}catch(err){
    console.log(err);
    res.status(500).json({
        message:"Server Error"
    });
}
    });//after this cart is no longer stored in node js its in redis
app.put("/api/cart/:id",authMiddleware,async(req,res)=>{//when u click + on product brwo send put/api/cart/1
        const userId=req.user.userId;
        const cartKey=`cart:${userId}`;//this is rediskey
        const id=req.params.id;
        const{ action }=req.body;//find cart find item inc/dec save db delete redis cache return updated cart
        try{
            const cart=await Cart.findOne({
                user:userId
            });
            if(!cart){
                return res.status(404).json({
                    message:"Cart not found"
                });
            }
            const item=cart.items.find(
                item=>item.productId.toString()===id
            );
            if(!item){
                return res.status(404).json({
                    message:"Product not found"
                });
            }
            if(action==="increase"){
                item.quantity++;
            }
            else if(action==="decrease"){
                item.quantity--;
                if(item.quantity<=0){
                    cart.items=cart.items.filter(
                        i=>i.productId.toString()!==id
                    );
                }
            }
            await cart.save();
            //invalidate cache
            await redisClient.del(cartKey);
            res.json({
                message:"Cart Updated",
                cart:cart.items
            });
        }
        catch(err){
            res.status(500).json({
                message:"server error"
            });
        }
    });
app.delete("/api/cart/:id",authMiddleware,async(req,res)=>{
    const userId=req.user.userId;
    const cartKey=`cart:${userId}`;
    const id=req.params.id;
    try{
        const cart=await Cart.findOne({
            user:userId
        });
        if(!cart){
            return res.status(404).json({
                message:"Cart not found"
            });
        }
        cart.items=cart.items.filter(
            item=>item.productId.toString()!==id
        );
        await cart.save();
        //invalidate cache
        await redisClient.del(cartKey);
        res.json({
            message:"Product removed",
            cart:cart.items
        });
    }
    catch(err){
        res.status(500).json({
            message:"Server Error"
        });
    }
});
app.get("/api/cart",authMiddleware,async(req,res)=>{//before reids browser getcart node ram cart
    const userId=req.user.userId;//now broswer getcart jwtsuth user id redis hit return miss mongodb redis set return
    const cartKey=`cart:${userId}`;
    try{
        //check redis
        const cachedCart=await redisClient.get(cartKey);
        if(cachedCart){
            console.log("Cart Cache Hit");
            return res.json(JSON.parse(cachedCart));
        }
        console.log("Cart Cache Miss");
        //fetch from mongo db
        const cart=await Cart.findOne({user:userId});
        if(!cart){
            return res.json([]);
        }
      //save to redis
      await redisClient.set(
        cartKey,
        JSON.stringify(cart.items)
      );
      res.json(cart.items);
    }
    catch(err){
        res.status(500).json({
            message:"Server error"
        });
    }
});
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