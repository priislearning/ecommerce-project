<div align="center">

# CommerceCore

A modular e-commerce backend engineered with **Node.js**, **Express.js**, **MongoDB**, **Redis**, and **Cloudinary**. It implements secure authentication, role-based access control, intelligent caching, media management, and RESTful APIs following the MVC architecture.

<br>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white)

</div>

---

## Application Architecture

### Overall System

```text
                                    ┌──────────────────┐
                                    │  Client / Browser│
                                    └─────────┬────────┘
                                              │
                                     HTTP / JSON Requests
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Express Application                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Express Router                                 │
├──────────────┬────────────────┬────────────────┬────────────────────────────┤
│ /auth        │ /products      │ /cart          │ /orders                    │
└──────┬───────┴───────┬────────┴───────┬────────┴───────────────┬────────────┘
       │               │                │                        │
       └─────────────────────────────────────────────────────────┘
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Middleware Pipeline                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Request Validation                                                        │
│ • JWT Authentication                                                        │
│ • Role-Based Authorization (RBAC)                                           │
│ • Centralized Error Handling                                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Controller Layer                               │
├──────────────┬────────────────┬────────────────┬────────────────────────────┤
│ Auth         │ Products       │ Cart           │ Orders                     │
└──────┬───────┴───────┬────────┴───────┬────────┴───────────────┬────────────┘
       │               │                │                        │
       └─────────────────────────────────────────────────────────┘
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             Persistence Layer                               │
├──────────────────────┬──────────────────────┬───────────────────────────────┤
│ MongoDB              │ Redis Cache          │ Cloudinary                    │
└──────────────────────┴──────────────────────┴───────────────────────────────┘
                                              │
                                              ▼
                                   JSON HTTP Response
```

## Tech Stack

| Category | Technologies |
|----------|--------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Caching** | Redis |
| **Authentication** | JSON Web Token (JWT) |
| **Authorization** | Role-Based Access Control (RBAC) |
| **Password Security** | bcrypt |
| **Media Management** | Cloudinary, Multer |
| **Validation** | express-validator |
| **Testing** | Jest, Supertest, MongoDB Memory Server |
| **Configuration** | dotenv |
| **Development Tools** | Nodemon, Git, GitHub |

## Project Structure

```text
CommerceCore
│
├── client/                     # Frontend
│
├── config/
│   └── cloudinary.js
│
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
│
├── data/
│   └── products.js
│
├── db/
│   ├── connect.js
│   └── redis.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── authorize.js
│   └── upload.js
│
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
│
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
│
├── tests/
│   ├── auth.test.js
│   └── setup.js
│
├── .env
├── app.js
├── server.js
├── package.json
└── README.md
```
## Key Features

### Authentication
- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes with authentication middleware

### Authorization
- Role-Based Access Control (RBAC)
- Admin-only product management
- Customer-specific operations
- Permission-based route protection

### Product Management
- Create, update, delete, and retrieve products
- Product search
- Pagination
- Sorting by different fields
- Product image uploads with Cloudinary

### Shopping Cart
- Add products to cart
- Update product quantity
- Remove products from cart
- Retrieve user's cart

### Order Management
- Place orders
- View order history
- Admin order management

### Performance
- Redis caching for product data
- Cache invalidation after product updates
- Optimized database queries

### Testing
- Integration testing with Jest and Supertest
- In-memory MongoDB for isolated test execution
- Authentication and authorization test coverage

  ## API Architecture

- RESTful API design
- Modular route organization
- MVC architecture
- Centralized error handling
- Middleware-driven request pipeline
- JSON-based request and response format

  ## Authentication Service

- JWT token generation and verification
- Secure password hashing with bcrypt
- User registration
- User login
- Current user profile endpoint
- Authentication middleware for protected routes

  ## API Endpoints

### Authentication
- Register User
- Login User
- Get Current User

### Products
- Get Products
- Get Product by ID
- Create Product
- Update Product
- Delete Product

### Cart
- Get Cart
- Add Item
- Update Quantity
- Remove Item
- Clear Cart

### Orders
- Place Order
- Get User Orders
- Get All Orders (Admin)

  ## Security

- JWT authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based authorization
- Input valid

  
  ## Communication Pattern

### Client Communication

- RESTful APIs over HTTP
- JSON request and response payloads
- Stateless request processing

### Request Pipeline

- Express Router
- Validation Middleware
- JWT Authentication
- RBAC Authorization
- Controller Execution

### Service Integration

- MongoDB for data persistence
- Redis for caching
- Cloudinary for image storage

### Response Handling

- Standardized JSON responses
- Appropriate HTTP status codes
- Centralized error handlingation
- Environment variable management

  ## Security Features

### Authentication

- JWT-based authentication
- Secure password hashing with bcrypt
- Token-based protected routes

### Authorization

- Role-Based Access Control (RBAC)
- Admin-only resource management
- Customer-specific route access

### Request Security

- Input validation using express-validator
- Centralized authentication middleware
- Standardized HTTP status codes

  ## API Design

### Architecture

- RESTful API design
- Resource-oriented endpoints
- Modular route organization

### Request Handling

- Express Router
- Middleware-driven request lifecycle
- Controller-based business logic

### Response Format

- JSON responses
- Consistent success and error structures
- Appropriate HTTP status codes

  ## Data Management

### Database

- MongoDB
- Mongoose ODM
- Schema-based document modeling

### Caching

- Redis for product caching
- Cache invalidation on data updates

### Media Storage

- Cloudinary for image hosting
- Multer for multipart file upload

  ## Testing

### Integration Testing

- Jest
- Supertest
- MongoDB Memory Server

### Test Coverage

- Authentication
- Authorization
- Protected Routes
- Error Handling

  ## Architecture Highlights

### Design Pattern

- Model-View-Controller (MVC)
- Layered architecture
- Modular code organization

### Performance

- Redis caching
- Efficient database queries
- Optimized middleware pipeline

### Scalability

- Feature-based module separation
- Reusable middleware
- Environment-based configuration

  ## Request Lifecycle

### Authentication Request

Client

↓
JWT Authentication Middleware

↓

Authorization (RBAC)

↓

Controller

↓

MongoDB / Redis / Cloudinary

↓

JSON Response

## API Modules

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Cart

```text
GET    /api/cart
POST   /api/cart
PATCH  /api/cart/:id
DELETE /api/cart/:id
```

### Orders

```text
POST   /api/orders
GET    /api/orders
```

  ## Caching Strategy

### Read Flow

```text
Client
   │
   ▼
Redis
   │
   ├──── Hit ─────► Response
   │
   ▼
MongoDB
   │
   ▼
Update Cache
   │
   ▼
Response
```

### Write Flow

```text
Create / Update / Delete
          │
          ▼
      MongoDB
          │
          ▼
Invalidate Cache
```


## Data Management

### MongoDB

```text
Collections
│
├── Users
├── Products
├── Carts
└── Orders
```

### Redis

```text
Cache
│
├── Product Listing
├── Product Details
└── Cache Invalidation
```

### Cloudinary

```text
Media Storage
│
├── Upload Images
├── Store Assets
└── Generate URLs
```

## Implementation Highlights

### JWT Authentication

```javascript
const token = jwt.sign(
  {
    userId: user._id,
    role: user.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1h",
  }
);
```

Generates signed JWT access tokens containing the authenticated user's identity and role for stateless authentication.

---

### Authentication Middleware

```javascript
const token = req.header("Authorization")?.replace(
  "Bearer ",
  ""
);

const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET
);

req.user = decoded;
next();
```

Verifies incoming JWTs and injects authenticated user information into the request lifecycle.

---

### Role-Based Access Control

```javascript
router.post(
  "/",
  authMiddleware,
  authorize("admin"),
  createProduct
);
```

Restricts privileged endpoints to authorized roles using reusable middleware.

---

### Password Security

```javascript
const hashedPassword = await bcrypt.hash(password, 10);

const isMatch = await bcrypt.compare(
  password,
  user.password
);
```

Passwords are securely hashed before storage and verified using bcrypt during authentication.

---

### Request Validation

```javascript
router.post(
  "/register",
  registerValidation,
  validate,
  registerUser
);
```

Incoming requests are validated before reaching the business logic to ensure consistent and secure data processing.

---

### REST API Routing

```javascript
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
```

Application routes are organized into feature-based modules following RESTful conventions.

---

### Redis Caching

```javascript
const cachedProducts = await redisClient.get(cacheKey);

if (cachedProducts) {
  return res.json(JSON.parse(cachedProducts));
}

await redisClient.set(
  cacheKey,
  JSON.stringify(products)
);
```

Frequently accessed product data is cached in Redis to reduce database load and improve response times.

---

### Cloudinary Integration

```javascript
const result = await cloudinary.uploader.upload(
  req.file.path,
  {
    folder: "products",
  }
);
```

Product images are uploaded to Cloudinary with only secure asset URLs stored in the database.

---

### MongoDB Schema

```javascript
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  brand: String,
  category: String,
  image: String,
  rating: Number,
  stock: Number,
});
```

Product information is modeled using Mongoose schemas for structured document management.

---

### Protected Route

```javascript
router.post(
  "/products",
  authMiddleware,
  authorize("admin"),
  upload.single("image"),
  createProduct
);
```

Demonstrates middleware composition for validation, authentication, authorization, file upload, and controller execution.

---

### Integration Testing

```javascript
it("should login successfully", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send(credentials);

  expect(res.status).toBe(200);
});
```

Authentication and authorization workflows are verified using integration tests with Jest and Supertest.

---

### Error Handling

```javascript
try {
  // business logic
} catch (error) {
  res.status(500).json({
    message: error.message,
  });
}
```

Consistent error responses are returned through centralized exception handling.

---

### Environment Configuration

```javascript
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

jwt.verify(token, process.env.JWT_SECRET);
```

Sensitive configuration values are managed through environment variables to support secure deployments.
  
