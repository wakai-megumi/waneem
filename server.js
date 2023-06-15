import { app } from './index.js';
import connectDB from './database.js';
import express from 'express';
import path from 'path';

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server listening on port ${PORT}`);
});
