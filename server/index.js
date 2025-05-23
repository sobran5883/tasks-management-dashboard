import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import morgan from "morgan"
import { errorHandler, routeNotFound } from "./middlewares/errorMiddleware.js"
import { dbConnection } from "./utils/index.js"
import routes from "./routes/index.js"

// Load environment variables
dotenv.config()

// Add more detailed logging
console.log('Starting server...')
console.log('Environment variables:', {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI ? 'MongoDB URI is set' : 'MongoDB URI is not set',
    JWT_SECRET: process.env.JWT_SECRET ? 'JWT Secret is set' : 'JWT Secret is not set'
})

// Initialize database connection
dbConnection().catch(err => {
    console.error('Failed to connect to database:', err)
    process.exit(1)
})

const PORT = process.env.PORT || 8800

const app = express()

// Middleware
app.use(
    cors({
        origin: ["https://tasks-management-dashboard-five.vercel.app", "http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan("dev"))

// Routes
app.use("/api", routes)

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
    next()
})

// Error handling
app.use(routeNotFound)
app.use(errorHandler)

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
    console.log('Server is ready to accept connections')
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err)
    // Close server & exit process
    server.close(() => process.exit(1))
})
