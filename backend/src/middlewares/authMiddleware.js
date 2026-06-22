import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Session from "../models/Session.js";


//authorization - xác minh user là ai
export const protectedRoute = async (req, res, next) => {
    try {
        //lấy token từ header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Không tìm thấy access token" });
        }

        //xác minh token hợp lệ
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if (err) {
                console.log(err);
                return res.status(403).json({ message: "Access Token không hợp lệ" });
            }
            //tìm user
            const user = await User.findById(decodedUser.userId).select("-hashedPassword"); //lấy tất cả thông tin user, trừ mật khẩu
            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy user" });
            }

            //cập nhật thời gian hoạt động cuối cùng (fire-and-forget, không await để không làm chậm response)
            Session.updateMany(
                { userId: user._id },
                { lastActiveAt: new Date() }
            ).catch(err => console.error("Lỗi cập nhật lastActiveAt:", err));

            //trả user về trong req ( để ở các bước tiếp theo, các api có thể tận dụng thông tin mà ko truy vấn lại)
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Lỗi khi xác minh JWT trong authMiddleware', error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}
