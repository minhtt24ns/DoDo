import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, // Bắt buộc phải có giá trị
        trim: true, // Loại bỏ khoảng trắng ở đầu và cuối chuỗi
        unique: true, // Phải là duy nhất
        lowercase: true, // Chuyển sang chữ thường
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
        trim: true,
    },
    avatarUrl: {
        type: String,
    },
    avatarId: {
        type: String,
    },
    phone: {
        type: String,
        sparse: true, // Cho phép null, nhưng không đc trùng
    },
    
}, {
    timestamps: true, // Khi timestamps = true thì Tự động thêm createdAt và updatedAt
});

const User = mongoose.model("User", userSchema);
export default User;