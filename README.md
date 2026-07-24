```markdown
# Mallng Backend API

A full-featured marketplace REST API built with Node.js, Express, and MongoDB. Mallng is a Nigerian-focused buy-and-sell platform where vendors can list products, buyers can make purchases with escrow protection, and real-time chat connects both parties.

## 🚀 Live API
`https://your-railway-url.up.railway.app`

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + Bcrypt
- **File Uploads:** Multer + Cloudinary
- **Payments:** Paystack (with escrow)
- **Real-time:** Socket.io
- **Validation:** Joi
- **Security:** Helmet, express-rate-limit, express-mongo-sanitize

## ✨ Features

- JWT authentication with role-based authorization (customer/vendor/admin)
- Product and category management with image uploads to Cloudinary
- Paystack payment integration with escrow system
- Order management with delivery confirmation and escrow release
- Real-time chat between buyers and vendors via Socket.io
- Centralized error handling and validation
- API rate limiting and security headers

## 📁 Project Structure

```

mallng-be/
├── config/
│   └── db.js
├── controllers/
│   ├── userController.js
│   ├── productsController.js
│   ├── categoryController.js
│   ├── paymentController.js
│   ├── orderController.js
│   └── chatController.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── UserModel.js
│   ├── ProductModel.js
│   ├── CategoryModel.js
│   ├── OrderModel.js
│   ├── PaymentModel.js
│   ├── ChatRoomModel.js
│   └── MessageModel.js
├── routes/
│   ├── userRoutes.js
│   ├── productsRoutes.js
│   ├── categoryRoutes.js
│   ├── paymentRoutes.js
│   ├── orderRoutes.js
│   └── chatRoutes.js
├── socket/
│   └── chatSocket.js
├── utils/
│   ├── generateToken.js
│   └── validation.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following:

```

MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
BASE_URL=
PORT=3000
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/users/register | Register new user | No |
| POST | /api/users/login | Login user | No |
| POST | /api/users/logout | Logout user | No |
| GET | /api/users/profile | Get user profile | Yes |

### Products
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/products | Get all products | No |
| POST | /api/products/create | Create product | Yes |
| PUT | /api/products/:id | Update product | Yes |
| DELETE | /api/products/:id | Delete product | Yes |

### Categories
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/categories | Get all categories | No |
| POST | /api/categories | Create category | Admin only |
| PUT | /api/categories/:id | Update category | Admin only |
| DELETE | /api/categories/:id | Delete category | Admin only |

### Payments
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/payments/initialize | Initialize payment | Yes |
| GET | /api/payments/verify | Verify payment | No |
| POST | /api/payments/webhook | Paystack webhook | No |

### Orders
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/orders/my-orders | Get buyer orders | Yes |
| GET | /api/orders/vendor-orders | Get vendor orders | Yes |
| GET | /api/orders/:id | Get single order | Yes |
| PUT | /api/orders/:id | Update order status | Yes |
| PUT | /api/orders/:id/confirm | Confirm delivery | Yes |

### Chat
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/chats/room | Find or create room | Yes |
| GET | /api/chats | Get all conversations | Yes |
| GET | /api/chats/:roomId | Get messages | Yes |

## 🔌 Socket.io Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| joinRoom | roomId | Join a chat room |
| sendMessage | { roomId, senderId, content } | Send a message |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| newMessage | message object | Receive new message |

## 🏃 Running Locally

```bash
# Clone the repository
git clone https://github.com/Funmibicode/mallng-be.git

# Navigate into the project
cd mallng-be

# Install dependencies
npm install

# Create your .env file and fill in the values
cp .env.example .env

# Start development server
npm run dev
```

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header for protected routes:

```
Authorization: Bearer <your_token>
```

## 💳 Payment Flow

1. Buyer calls `POST /api/payments/initialize` with items and vendorId
2. Backend creates Order and Payment records, calls Paystack API
3. Backend returns `authorization_url` — frontend redirects buyer there
4. Buyer completes payment on Paystack's secure page
5. Paystack redirects to `GET /api/payments/verify` with reference
6. Backend verifies with Paystack, updates Order to "paid" (escrow held)
7. Vendor ships item, updates order to "shipped"
8. Buyer confirms receipt via `PUT /api/orders/:id/confirm`
9. Escrow released to vendor

## 💬 Real-time Chat

Socket.io powers real-time messaging between buyers and vendors. Chat history is persisted in MongoDB so messages are available after disconnect.

## 👨‍💻 Built By

**Funmibi** — Self-taught MERN Stack Developer based in Nigeria

- GitHub: [@Funmibicode](https://github.com/Funmibicode)
- LinkedIn: [Add your LinkedIn URL]
- Twitter/X: [Add your Twitter URL]

> Built entirely on a mobile phone using Acode + Alpine Linux terminal 🚀

## 📄 License

MIT
```

Copy everything between the triple backticks at the top and bottom. Save it as `README.md` in your project root, then:

```
git add README.md
git commit -m "docs: add project README"
git push origin main
```