import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController.ts";
import { validateBody } from "../middlewares/validation.ts";
import { insertUserSchema } from "../db/schema.ts";
import z from "zod";

const router = Router();


const loginSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.email("Invalid email address")
})

const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.email("Invalid email address"),
    role: z.enum(["user", "admin"], "Role must be either 'user' or 'admin'"),
    studentId: z.string().optional(),
    studentLRN: z.string().optional(),
    studentStrand: z.enum(["ICT", "HRCTO", "GAS", "HUMSS", "ABM", "STEM", "AAD"]).optional(),
    studentSection: z.string().optional()
})


router.post("/register", validateBody(registerSchema), registerUser);
router.post("/login", validateBody(loginSchema), loginUser);


export default router;