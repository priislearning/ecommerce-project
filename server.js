const products=require("./data/products.js");
const express=require('express');
const path=require('path');
const app=express();// create an express application
app.use(express.static(path.join(__dirname,"client"))); // serve static files from public folder
const port=3000;
app.get('/api/products',(req,res)=>{ // handles a get request
    res.json(products);
});

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});