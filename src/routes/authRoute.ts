import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController.ts";
import { validateBody } from "../middlewares/validation.ts";
import { insertUserSchema } from "../db/schema.ts";
import z from "zod";

const router = Router();

const loginSChema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.email("Invalid email address")
})

router.post("/register", validateBody(insertUserSchema), registerUser);
router.post("/login", validateBody(loginSChema), loginUser);

export default router;