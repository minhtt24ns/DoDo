import express from "express";
import { refreshTokens, signIn, signOut, signUp } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/signout", signOut);

router.post("/refresh",refreshTokens)

export default router;