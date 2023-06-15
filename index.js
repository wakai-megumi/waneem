import express from 'express';
import dotenv from 'dotenv';
import hotelRouter from './routers/hotel.route.js';
import userRouter from './routers/user.route.js';
import authRouter from './routers/auth.route.js';
import roomRouter from './routers/rooms.route.js';
import bookingrouter from './routers/booking.route.js';

import cookieParser from 'cookie-parser';
import ErrorHandler from './utils/ErrorHandler.js';

dotenv.config();

export const app = express();

app.use(cookieParser());

app.use((req, res, next) => {
    const allowedOrigins = [
        'https://waneem-admin.onrender.com',
        'https://waneem.onrender.com',
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());

// Routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/hotels', hotelRouter);
app.use('/api/v1/room', roomRouter);
app.use('/api/v1/booking', bookingrouter);
app.use('/api/v1/user', userRouter);

const token = 'Sdfsdfsd';
app.get('/api/v1', (req, res) => {
    res
        .status(200)
        .cookie('access_token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'none',
            secure: true,
        })
        .send('hello from express');
});

// Error middleware
app.use(ErrorHandler);

