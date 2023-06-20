import express from 'express'
import dotenv from "dotenv"
import hotelRouter from './routers/hotel.route.js'
import userRouter from './routers/user.route.js'
import authRouter from './routers/auth.route.js'
import roomRouter from './routers/rooms.route.js'
import bookingrouter from './routers/booking.route.js'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import ErrorHandler from './utils/ErrorHandler.js'
dotenv.config()

export const app = express();
app.use(express.json())

app.use(cookieParser())
app.set("trust proxy", 1)


//middleware
app.use("*", cors({
    // origin: ["https://waneem-admin.onrender.com", "https://waneem.onrender.com"],
    origin: "http://localhost:5174",
    credentials: true,
    optionSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


//router
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/hotels', hotelRouter)
app.use('/api/v1/room', roomRouter)
app.use('/api/v1/booking', bookingrouter)


app.use('/api/v1/user', userRouter)






//error middleware

app.use(ErrorHandler)

