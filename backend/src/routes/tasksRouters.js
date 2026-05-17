import express from "express"; // Gọi các API
import { createTask, getAllTasks, updateTask, deleteTask } from "../controllers/tasksControllers.js";

const router = express.Router();

router.get("/", getAllTasks);

router.post("/", createTask);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

export default router;