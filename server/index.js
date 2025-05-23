import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import morgan from "morgan"
import { errorHandler, routeNotFound } from "./middlewares/errorMiddleware.js"
import { dbConnection } from "./utils/index.js"
import routes from "./routes/index.js"

dotenv.config()

// Add more detailed logging
console.log('Starting server...')
console.log('Environment variables:', {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI ? 'MongoDB URI is set' : 'MongoDB URI is not set'
})

dbConnection()

const PORT = process.env.PORT || 8800

const app = express()

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
app.use("/api", routes)

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

app.use(routeNotFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
    console.log('Server is ready to accept connections')
})
