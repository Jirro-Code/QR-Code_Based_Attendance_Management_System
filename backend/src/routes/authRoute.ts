import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.ts";
import { validateBody } from "../middlewares/validation.ts";
import { userRoleSchema, userStrandSchema } from "../db/schema.ts";
import z from "zod";
import { authAdminToken } from "../middlewares/authToken.ts";

const router = Router();


const loginSchema = z.discriminatedUnion("role", [
    z.object({
        role: z.literal("user"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        studentId: z.string().length(13, "Student ID must be exactly 13 characters long")
    }),
    z.object({
        role: z.literal("admin"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        email: z.email("Invalid email address")
    })
]);

const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.email("Invalid email address"),
    role: userRoleSchema,
    studentId: z.string().length(13, "Student ID must be exactly 13 characters long").optional(),
    studentLRN: z.string().length(12, "Student LRN must be exactly 12 characters long").optional(),
    studentStrand: userStrandSchema.optional(),
    studentSection: z.string().optional()
})


router.post("/login", validateBody(loginSchema), loginUser);
router.post("/logout", logoutUser);

router.use(authAdminToken);
router.post("/register", validateBody(registerSchema), registerUser);

export default router;