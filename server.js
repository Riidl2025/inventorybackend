// const express = require("express")
// const mongoose = require("mongoose")
// const cors = require("cors")
// const dotenv = require("dotenv")
// const morgan = require("morgan")

// // Load environment variables
// dotenv.config()

// // Import routes
// const inventoryRoutes = require("./routes/inventoryRoutes")
// const stockInRoutes = require("./routes/stockInRoutes")
// const stockOutRoutes = require("./routes/stockOutRoutes")
// const dashboardRoutes = require("./routes/dashboardRoutes")

// // Initialize express app
// const app = express()

// // Middleware
// app.use(cors())
// app.use(express.json())
// app.use(morgan("dev"))

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   tls: true,
//   tlsAllowInvalidCertificates: true // try ONLY for testing
// })


// // Routes
// app.use("/api/inventory", inventoryRoutes)
// app.use("/api/stock/in", stockInRoutes)
// app.use("/api/stock/out", stockOutRoutes)
// app.use("/api/dashboard", dashboardRoutes)

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).json({
//     success: false,
//     message: "Something went wrong on the server",
//     error: process.env.NODE_ENV === "development" ? err.message : undefined,
//   })
// })

// // Start server
// const PORT = process.env.PORT || 5000
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const morgan = require("morgan")
const path = require("path")

// Load environment variables
dotenv.config()

// Import routes
const inventoryRoutes = require("./routes/inventoryRoutes")
const stockInRoutes = require("./routes/stockInRoutes")
const stockOutRoutes = require("./routes/stockOutRoutes")
const returnRoutes = require("./routes/returnRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")

// Initialize express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// API Routes
app.use("/api/inventory", inventoryRoutes)
app.use("/api/stock/in", stockInRoutes)
app.use("/api/stock/out", stockOutRoutes)
app.use("/api/return", returnRoutes)
app.use("/api/dashboard", dashboardRoutes)

// API route testing endpoint
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "API is working correctly" })
})

// Error handling for API routes - ensure JSON responses for all API errors
app.use("/api", (err, req, res, next) => {
  console.error("API Error:", err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`API available at http://localhost:${PORT}/api/test`)
})
