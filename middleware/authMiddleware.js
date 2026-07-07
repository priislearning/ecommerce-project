//jwt never ask mongo db
//jwt verification is pure maths thats why jwts is so fast and efficient
//then why do we use mongo db bz jwt only has the user id and we need to fetch the user details from mongo db
const jwt=require("jsonwebtoken");//to create and verify token
const authMiddleware=(req,res,next)=>{
    try{
        console.log("Authorization Header:", req.headers.authorization);
        const authHeader=req.headers.authorization;//browser send extra info called headers
        if(!authHeader||!authHeader.startsWith("Bearer ")){//it is an international http standard to send the token in the authorization header with the prefix "Bearer "
            return res.status(401).json({//401 means unauthorized
                message:"No token provided"
            });
        }
        const token=authHeader.split(" ")[1];//bz the first item before space is "Bearer" and the second item is the actual token
        console.log("Token:", token);
        const decoded=jwt.verify(token,process.env.JWT_SECRET);//split the token into header payload and signature and verify the signature using the secret key
        console.log("Decoded:", decoded);
        req.user=decoded;// so now no need to verify this user id again
        next();//authentication successful so we can move to the next middleware or route handler
    } catch (err) {
        console.log("JWT ERROR:", err.message);
        return res.status(401).json({
            message:"Invalid token"
        });
    }
};
module.exports=authMiddleware;