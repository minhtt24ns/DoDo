import express from "express";
import tasksRouters from "./routes/tasksRouters.js";
import authRouters from "./routes/authRoute.js";
import usersRoute from "./routes/usersRoute.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import path from "path";



dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const app = express();


//middleware
if(process.env.NODE_ENV === "development"){
    app.use(cors({origin: process.env.CLIENT_URL,credentials:true}));
}
app.use(express.json());
app.use(cookieParser());

//public routes
app.use("/api/auth", authRouters);

//private routes
app.use("/api/users", protectedRoute, usersRoute);
app.use("/api/tasks", protectedRoute, tasksRouters);

// Phục vụ file tĩnh frontend (production) - ĐẶT SAU các API route
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,'../frontend/dist')))

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,'../frontend/dist/index.html'))
    })
}

// Connect to MongoDB
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server đang chạy ở cổng ${PORT}`);
    });
});