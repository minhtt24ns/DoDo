import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày 24 giờ 60 phút 60 giây
export const signUp = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;

        if (!username || !email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: "Không thể thiếu thông tin" });
        }

    //Kiểm tra username tồn tại chưa
        const duplicate = await User.findOne({ username });
        if (duplicate) {
            return res.status(409).json({ message: "Username đã tồn tại" });
        }

    //Mã hóa password
        const hashedPassword = await bcrypt.hash(password, 10);


    //Tạo user mới
        await User.create({
            username,
            email,
            hashedPassword,
            displayName: `${lastName} ${firstName}`,
        });


    //return
        return res.status(201).json({ message: "Đăng ký thành công" });


    } catch (error) {
        console.error('Lỗi khi gọi API signUp', error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
};

export const signIn = async (req, res) => {
    try {
        
        //lấy input
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Không thể thiếu thông tin" });
        }

        //lấy hashedPassword trong db để so sánh với password input
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Tài khoản hoặc mật khẩu không đúng" });
        }

        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordCorrect) {
            return res.status(401).json({ message: "Tài khoản hoặc mật khẩu không đúng" });
        }

        //nếu khớp, tạo accessToken với JWT
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );

        //tạo refreshToken
        const refreshToken = crypto.randomBytes(40).toString("hex");

        //tạo session mới để lưu refresh token
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });

        //gửi refresh token về client thông qua cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,     //cookie này không thể bị truy cập bởi javascript
            secure: true,       //cookie chỉ được gửi qua https
            sameSite: "none", //cho phép backend và frontend chạy trên 2 domain khác nhau
            maxAge: REFRESH_TOKEN_TTL,
        });

        //trả access token về trong res
        return res.status(200).json({ message:`User ${user.displayName} đã đăng nhập thành công`,accessToken });
        
    } catch (error) {
        console.error('Lỗi khi gọi API signIn', error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
};  

export const signOut = async (req, res) => {
    try {
        //lấy refresh token từ cookie
        const token = req.cookies?.refreshToken;

        if (token) {
           //xóa refresh token trong Session
            await Session.deleteOne({ refreshToken: token });

            //xóa refresh token trong cookie
            res.clearCookie("refreshToken"); //xóa cookies trong trình duyệt, đảm bảo user ko còn token nào lưu lại trên client
        }

        //trả về response
        return res.status(204).send();
    } catch (error) {
        console.error('Lỗi khi gọi API signOut', error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}

// tạo access token mới từ refresh token
export const refreshTokens = async(req, res) => {
    try {
        //lấy refresh token từ cookie
        const token = req.cookies?.refreshToken;

        if (!token) return res.status(401).json({ message: "Refresh token không tồn tại" });

        //so sánh refresh token trong cookie với refresh token trong database
        const session = await Session.findOne({ refreshToken: token });

        if (!session) return res.status(403).json({ message: "Refresh token không hợp lệ hoặc đã hết hạn" });
        

        //kiểm tra token hết hạn chưa
        if (session.expiresAt < new Date()) {
            return res.status(401).json({ message: "Refresh token đã hết hạn" });
        }
        
        //tạo access token mới từ refresh token
        const accessToken = jwt.sign(
            { userId: session.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );

        //trả về access token mới
        return res.status(200).json({ accessToken });
        
    } catch (error) {
        console.error('Lỗi khi gọi API refreshTokens', error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}
