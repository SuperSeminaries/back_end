import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import app from "./app.js";




dotenv.config();

connectDB().then(()=> {
    app.listen(process.env.PORT || 5000, ()=> {
        console.log(`server listen on port ${process.env.PORT}`);
    })
}).catch((error)=> {
    console.log("mongoDB connection faild !!!", error);
})

/*
// Use an async function to handle asynchronous code
const startServer = async () => {
    try {
      // Connect to MongoDB
      await connectDB();
      
      // Start the Express server
      const port = process.env.PORT || 5000;
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } catch (error) {
      console.error("MongoDB connection failed:", error);
      // Handle the error as needed (e.g., exit the process)
      process.exit(1);
    }
  };
  
  // Call the async function to start the server
  startServer(); */