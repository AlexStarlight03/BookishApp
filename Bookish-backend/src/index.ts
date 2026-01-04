// import 'dotenv/config'
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import prisma  from "./prisma/prisma.js";

// import studentRoutes from './routes/studentRoutes'
// import clubRoutes from './routes/clubRoutes';
// import bookRoutes from "./routes/book.routes";
// import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());


// app.use('/auth', authRoutes);
// app.use('/books', bookRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
