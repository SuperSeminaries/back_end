import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
const app = express();

app.use(cors());
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser())


import userRouter from "./src/routes/user.routes.js";
import bodyParser from "body-parser";

app.use('/users', userRouter)

export default app;