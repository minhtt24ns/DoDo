import mongoose from "mongoose"; //Định nghĩa kiểu dữ liệu

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    status:{
        type: String,
        enum: ["active", "complete"],
        default: "active",
    },
    completedAt: {
        type: Date,
        default: null,
    }
    },
{
    timestamps: true, // createdAt và updatedAt tự động thêm vào
}
);

const Task = mongoose.model("Task", taskSchema);
export default Task;