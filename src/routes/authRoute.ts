import { Router } from "express";
import { registerUser } from "../controllers/authController.ts";
import { validateBody } from "../middlewares/validation.ts";
import { insertUserSchema } from "../db/schema.ts";
import z from "zod";

const router = Router();


router.post("/api/register", validateBody(insertUserSchema), registerUser);

export default router;