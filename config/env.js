const { cleanEnv, str, port } = require("envalid");

cleanEnv(process.env, {
    PORT: port(),
    MONGO_URI: str(),
    JWT_SECRET: str(),
    REDIS_URL: str()//check every one if anyone missing server exist immediately
});
/* 
Environment Validation
process.env is just a JavaScript object.
Missing variables become undefined.
cleanEnv() validates all environment variables before the app starts.
str() → required string.
port() → valid port number.
If validation fails, the application exits immediately (Fail Fast Principle).
Validation should happen before connecting to MongoDB, Redis, or starting Express.
Environment variables are validated before connecting to MongoDB or Redis because the application should verify that all required configuration exists before using any resources. If validation fails, the application exits immediately instead of opening database connections and failing later. This follows the Fail Fast Principle and avoids starting the application in an invalid state.
*/


/*
NoSQL Injection
MongoDB supports query operators like $ne, $gt, $lt, $or, etc.
If user input is passed directly into MongoDB queries, an attacker can send these operators instead of normal values.
MongoDB interprets them as commands, not plain data.
This can change the behavior of queries and potentially expose or manipulate data.
The solution is to sanitize user input before it reaches MongoDB (which we'll implement using express-mongo-sanitize next).
*/