import jwt from "jsonwebtoken"
import mongoose from "mongoose"

export const dbConnection = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables')
        }
        
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("DB connection established")
    } catch (error) {
        console.error("DB Connection Error:", error.message)
        // Exit process with failure
        process.exit(1)
    }
}

export const createJWT = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    })

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // Changed from strict to none to allow cross-origin requests
        maxAge: 1 * 24 * 60 * 60 * 1000, //1 day
    })
}
