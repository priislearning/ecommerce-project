const Product=require("./models/Product.js");
const products=require("./data/products.js");
const express=require('express');
const path=require('path');
const connectDB=require("./db/connect.js");
const app=express();// create an express application
app.use(express.json());
let cart=[];
app.use(express.static(path.join(__dirname,"client"))); // serve static files from public folder
const port=3000;
app.get('/api/products',(req,res)=>{ // handles a get request
    try{
        const products=await Product.find();
        res.json(products);
    }
    catch(error){
        res.status(500).json({message:"Server error"});
    }
});
app.post("/api/cart",(req,res)=>{
    const { id }=req.body;//Express converts JSON into a JavaScript object.
    const product=products.find(p=>p.id===id);
    if(!product){
        return res.status(404).json({
            message:"Product not found"
        });
    }
    const existingItem=cart.find(item=>item.id===id);
    if(existingItem){
          existingItem.quantity+=1;
    }
    else{
        cart.push({
            ...product,quantity:1
        })
    }
    res.status(201).json({
        message:"product added to cart",
        cart
    })
    });
    app.put("/api/cart/:id",(req,res)=>{
        const id=Number(req.params.id);
        const item=cart.find(item=>item.id===id);
        if(!item){
            return res.status(404).json({
                message:"Product not found in cart"
            });
        }
        const {action}=req.body;
        if(action==="increase"){
            item.quantity++;
        }
        else if(action==="decrease"){
            item.quantity--;
            if(item.quantity<=0){
                cart=cart.filter(i=>i.id!==id);
            }
        }
        res.json({
            message:"Cart updated",
            cart
        })
    })
app.delete("/api/cart/:id",(req,res)=>{
    const id=Number(req.params.id);
    cart=cart.filter(item=>item.id!==id);
    res.json({
        message:"product removed from cart",
        cart
    });
});
app.get("/api/cart",(req,res)=>{
    res.json(cart);
})
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
async function start(){
    await connectDB();
    await seedProducts();
    app.listen(port,()=>{
        console.log(`server is running on port ${port}`);
    });
}
start();