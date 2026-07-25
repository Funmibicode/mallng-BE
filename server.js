import express from 'express';
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors';
import connectDB from "./config/db.js";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import chatSocket from "./socket/chatSocket.js";

// import routes
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productsRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import chatRoutes from "./routes/chatRoutes.js";

// import error middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;


// ── Create HTTP server wrapping Express ──
const httpServer = createServer(app);


// ── Create Socket.io server ──
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


// ── Rate limiters ─
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { msg: "Too many requests, please try again after 15 minutes" },
  legacyHeaders: false,
  standardHeaders: true,
});


const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    msg: "Too many payment attempts, please try again later",
  },
  legacyHeaders: false,
  standardHeaders: true,
});



// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(mongoSanitize());
app.use(limiter);


// ── REST API Routes ──
app.use("/api/payments/initialize", paymentLimiter);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/chats", chatRoutes);



// ── Chat Socket ──
chatSocket(io);


// ── Error Middleware — always last ──
app.use(notFound);
app.use(errorHandler);


// ── Start server ──
httpServer.listen(port, () => console.log(`Server running @${port}`));