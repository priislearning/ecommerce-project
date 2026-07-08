//we started html js express mongodb jwt redis 

//redis is an in memory database tenporary fast storage
//mongo db store data on disk permanent storage
//disk is slower
//ram is faster

//cache miss
//flow client express redis pro notf found mongo db store product in reddis returh 
//cahce hit if redis found product
//redis has data that is req freq and changes rarely for us product
//redis is perfect for shoppinfg cart bz it is temporary someone add shoes later remove them
//key store card id value store cart item it e=gets id by jwt
//browser speaks json json is text
//internet understand text obj-string-internet-obj
//json.stringify-> object->string
//json.aprse->string to 
//app.use(express.jspn) automatically convert string to obj
//before browser node cart
//redis
//broswer express jwt redis express brow
//ttl time to live delete old cart with redis  imagine 1 crore user add something in cart half never return without ttl redis memory full with ttl old cart disapper automatically EX:3600 expriry is 3600 sec that is 1 hour
//add is evryplace we have redisclient.set
//cache invalidation
//supose redis store momgdb value and mongodb value updates redis has old value called stale cache outdated cahce
//mongodb updates delete redis cache next req redis empty read mongo store fresh data
//connection mongo db and redos
//In the PUT route, we first update the cart in MongoDB because MongoDB is our permanent database and the source of truth. After saving the updated cart with await cart.save(), we delete the Redis cache using await redisClient.del(cartKey) instead of updating it immediately. This is because the user might make several more changes (like pressing + multiple times), and rebuilding the cache after every update would cause unnecessary writes to Redis. By simply deleting the cache, we mark it as outdated. The next time the user sends a GET /api/cart request, the server first checks Redis, gets a cache miss, fetches the latest cart from MongoDB, stores it back in Redis using redisClient.set(), and then returns it to the browser. This approach is called the Cache-Aside Pattern and is widely used because all cache creation happens in one place (the GET route), while all write operations (POST, PUT, DELETE) only update MongoDB and invalidate the cache, making the code simpler, faster, and easier to maintain.

//input validation any invalid should not reach controllers so now flow is brow post/api server authroutes validation auth controller mongo
//Helmet is simply an Express middleware that automatically adds many useful security headers.
//Think of it as helmet as safety rules not police thr beowser use it attach security headers
//I would use app.use(helmet()) because Helmet is a global security middleware. Every request and response should receive the same security headers. Placing it once in server.js avoids code duplication, keeps the code maintainable, ensures consistency across all routes, and follows the DRY (Don't Repeat Yourself) principle.
//why cant brow attach ghem why does server send
//bz browser doesnt know the intention of server he browser cannot decide security policies because it doesn't own the application. The server knows how its resources should be used, so it sends security headers as instructions. The browser's responsibility is to enforce those instructions.
//CORS does not apply to Postman because Postman is not a browser. (thereofre not on phone)CORS is a browser security policy (Same Origin Policy) enforced by browsers like Chrome, Firefox, and Edge. Since Postman doesn't enforce Same Origin Policy, it can make requests to any server.
//cors is broser security mech First Principle

//Browsers don't trust one website accessing another website's data.

//This rule is called it checks for did the server tell me this origin is allowed

//Same Origin Policy (SOP) origin has 3 parts protocol host port 
//cors only add one http header Using app.use(cors()) allows all origins, which is convenient during development but not ideal for production. In production, we specify trusted origins using the origin option so that only authorized frontend applications can access our backend from a browser. This reduces unnecessary exposure and follows the principle of least privilege.
//the backend never fails the borw blocked access after receiving the response contaning no header of access control
//we get 403 forbidden Yes. CORS is enforced only by browsers. Tools like Postman, curl, or mobile applications don't enforce CORS, so they can send requests directly to the backend. Therefore, CORS should never be considered a security mechanism for protecting APIs.

//Notice the last sentence:

//CORS  cross origin resourse sharing s NOT API security
//jwt protect browser postman mobile app curl
//cors protecxt broweser If the frontend and backend have the same protocol, host, and port, they are considered the same origin. Since the browser's Same Origin Policy already allows communication within the same origin, CORS is not required. CORS is only needed when the frontend and backend are on different origins.
//Without CORS, any website could use JavaScript to read data from another website where the user is logged in (like Gmail or a bank). The browser prevents this by enforcing the Same Origin Policy.

//Environment validation checks whether all required environment variables exist and have valid values before the server starts.
//Why use a library?

//Instead of manually checking every variable:


//if (!process.env.JWT_SECRET) { ... }

//libraries like envalid or zod can:

//Ensure required variables exist.
//Validate types (e.g., number, URL, string).
//Provide defaults.
//Produce clear startup errors.
//A backend should validate critical environment variables like JWT_SECRET during startup and stop immediately if they are missing. This follows the Fail Fast Principle. If the server continues running with missing configuration, the application may work for some time and then fail only when that feature is used (for example, during JWT verification). Those runtime errors are much harder to debug and can affect users. Failing at startup makes the problem obvious and prevents deploying a broken application.


/*
NoSQL Injection
MongoDB supports query operators like $ne, $gt, $lt, $or, etc.
If user input is passed directly into MongoDB queries, an attacker can send these operators instead of normal values.
MongoDB interprets them as commands, not plain data.
This can change the behavior of queries and potentially expose or manipulate data.
The solution is to sanitize user input before it reaches MongoDB (which we'll implement using express-mongo-sanitize next).
*/

/**
 nterviewer:

Does express-mongo-sanitize make MongoDB secure?

Answer:

❌ No.

It only protects against one class of attacks—NoSQL Injection using MongoDB operators.

You still need

Validation
Authentication
Authorization
Rate Limiting
Helmet
XSS Protection

for a secure backend.
Place it before your routes so every request is sanitized.
 */