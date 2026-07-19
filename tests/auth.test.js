require("./setup");

const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const bcrypt = require("bcrypt");

describe("Authentication API", () => {

    test("should return 404 for an unknown route", async () => {
        const res = await request(app).get("/this-route-does-not-exist");

        expect(res.statusCode).toBe(404);
    });

    test("should not register an existing user", async () => {

        // First registration
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Priyanshi",
                email: "test@test.com",
                password: "password123"
            });

        // Second registration with same email
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Priyanshi",
                email: "test@test.com",
                password: "password123"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("User already exists");
    });

    test("should register a new user", async () => {

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Priyanshi",
                email: "priyanshi@test.com",
                password: "password123"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User registered successfully");
    });

    test("should login an existing user", async () => {

        // Register user
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Priyanshi",
                email: "login@test.com",
                password: "password123"
            });

        // Login
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "login@test.com",
                password: "password123"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Login successful");
        expect(res.body.token).toBeDefined();
        expect(res.body.role).toBe("customer");
    });

    test("should not login with wrong password", async () => {

        // Register user
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "wrong@test.com",
                password: "password123"
            });

        // Login with wrong password
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "wrong@test.com",
                password: "wrongpassword"
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Invalid email or password");
    });

    test("should get current user profile", async () => {

        // Register user
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "me@test.com",
                password: "password123"
            });

        // Login to get JWT token
        const loginRes = await request(app)
            .post("/api/auth/login")
            .send({
                email: "me@test.com",
                password: "password123"
            });

        // Access protected route
        const res = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${loginRes.body.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("Test User");
        expect(res.body.email).toBe("me@test.com");

        // Password should never be returned
        expect(res.body.password).toBeUndefined();
    });

});
test("should not allow creating product without token", async () => {

    const res = await request(app)
        .post("/api/products")
        .send({
            name: "iPhone",
            price: 100000,
            brand: "Apple",
            category: "Mobile",
            stock: 10
        });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("No token provided");
});
test("should not allow customer to create product", async () => {

    await request(app)
        .post("/api/auth/register")
        .send({
            name: "Customer",
            email: "customer@test.com",
            password: "password123"
        });

    const loginRes = await request(app)
        .post("/api/auth/login")
        .send({
            email: "customer@test.com",
            password: "password123"
        });

    const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${loginRes.body.token}`)
        .send({
            name: "iPhone",
            price: 100000,
            brand: "Apple",
            category: "Mobile",
            stock: 10
        });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Access Denied");
});
test("should reject invalid JWT", async () => {

    const res = await request(app)
        .post("/api/products")
        .set("Authorization", "Bearer invalid-token")
        .send({
            name: "iPhone",
            price: 100000
        });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid token");
});
test("should not access profile without token", async () => {

    const res = await request(app)
        .get("/api/auth/me");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("No token provided");
});
test("should reject malformed authorization header", async () => {
    const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "InvalidToken");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("No token provided");
});