import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";

const connectDB = async() => {
try {
    const connection = await mongoose.connect(`${process.env.MONGO_URI }/${process.env.DB_NAME}`)
    console.log(`mongoDB connected || DB HOST: ${connection.connection.host}`)
} catch (error) {
    console.log("message", error);
}
}

export default connectDB
