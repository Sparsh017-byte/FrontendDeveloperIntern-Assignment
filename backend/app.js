import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import notesRoutes from './routes/notesRoutes.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js'


const app = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}));


app.get('/',(req,res)=>{
    res.send("Api running.....");
})

app.use('/api/v1/users',authRoutes);
app.use('/api/v1/notes', notesRoutes);
app.use(errorMiddleware);

export default app;
