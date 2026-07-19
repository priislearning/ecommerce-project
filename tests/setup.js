const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const connectDB = require("../db/connect");

let mongoServer;

beforeAll(async () => {
    console.log("SETUP START");

    mongoServer = await MongoMemoryServer.create();

    console.log("MONGO SERVER CREATED");

    const uri = mongoServer.getUri();

    console.log(uri);

    await connectDB(uri);

    console.log("CONNECTED");
});

afterEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});