
import 'dotenv/config';
import express, { type Request, type Response } from "express";
import prisma  from "./prisma/prisma.js";

import bookRoutes from "./routes/bookRoutes";
import authorRoutes from "./routes/authorRoutes";
import bookAuthorRoutes from "./routes/bookAuthorRoutes";
import bookCategoryRoutes from "./routes/bookCategoryRoutes";
import bookshelfRoutes from "./routes/bookshelfRoutes";
import bookStatusRoute from "./routes/bookStatusRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import userRoutes from "./routes/userRoutes";


console.log('DATABASE_URL:', process.env.DATABASE_URL);
const app = express();
app.use(express.json());


app.use('/book', bookRoutes);
app.use('/author', authorRoutes);
app.use('/bookAuthor', bookAuthorRoutes);
app.use('/bookCategory', bookCategoryRoutes);
app.use('/bookshelf', bookshelfRoutes);
app.use('/bookStatus', bookStatusRoute);
app.use('/category', categoryRoutes);
app.use('/review', reviewRoutes);
app.use('/user', userRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
