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