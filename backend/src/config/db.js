import mongoose from "mongoose"; //Kết nối database
import dns from "node:dns";

export const connectDB = async () => {
    try {
        dns.setServers(["8.8.8.8", "8.8.4.4"]); // Sửa lỗi Node.js không phân giải được SRV record qua DNS của mạng
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};