import express from "express";
import tasksRouters from "./routes/tasksRouters.js";
import authRouters from "./routes/authRoute.js";
import usersRoute from "./routes/usersRoute.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/authMiddleware.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();


//middleware
app.use(cors({origin: process.env.CLIENT_URL,credentials:true}));
app.use(express.json());
app.use(cookieParser());

//public routes
app.use("/api/auth", authRouters);

//private routes
app.use(protectedRoute);
app.use("/api/users", usersRoute);
app.use("/api/tasks", tasksRouters);

// Connect to MongoDB
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server đang chạy ở cổng ${PORT}`);
    });
});