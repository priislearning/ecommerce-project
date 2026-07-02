const express=require('express');
const path=require('path');
const app=express();// create an express application
app.use(express.static(path.join(__dirname,"client"))); // serve static files from public folder
const port=3000;
app.get('/',(req,res)=>{ // handles a get request
    res.sendFile(path.join(__dirname,"client","index.html"));//send a response to browser
});
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});