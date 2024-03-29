import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
const app = express();
import dotenv from "dotenv";
dotenv.config();

app.use(cors());

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser())


import userRouter from "./src/routes/user.routes.js";


app.use('/users', userRouter)

export default app;