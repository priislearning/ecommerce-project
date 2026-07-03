const products=require("./data/products");;
const express=require('express');
const path=require('path');
const app=express();// create an express application
app.use(express.json());
let cart=[];
app.use(express.static(path.join(__dirname,"client"))); // serve static files from public folder
const port=3000;
app.get('/api/products',(req,res)=>{ // handles a get request
    res.json(products);
});
app.post("/api/cart",(req,res)=>{
    const { id }=req.body;
    const product=products.find(p=> p.id===id);
    if(!product){
        return res.status(404).json({
            message:"product not found"
        });
    }
    cart.push(product);
    res.status(201).json({
        message:"product added to cart",
        cart
    });
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
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});