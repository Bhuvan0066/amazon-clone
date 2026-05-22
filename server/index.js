const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
// mongoSanitize removed
const rateLimit = require("express-rate-limit");
// hpp removed
const morgan = require("morgan");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require('./routes/uploadRoutes');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, 
  legacyHeaders: false, 
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: "10kb" })); // Body limit is 10kb

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize()); removed

// Prevent parameter pollution
// app.use(hpp()); removed

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/products", productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/upload', uploadRoutes);

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Test Route
app.get("/", (req, res) => {
  res.send("API Running Successfully - Secure & Optimized");
});

// Global Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


