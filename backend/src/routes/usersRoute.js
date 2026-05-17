import express from "express";
import { authMe } from "../controllers/usersController.js";

const router = express.Router();

router.get("/me", authMe);

export default router;