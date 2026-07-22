import Router from "express";
import { authAdminToken } from "../middlewares/authToken.ts";
import { validateQuery, validateBody, validateParams} from "../middlewares/validation.ts";
import { getAllUserByRole, getAllUsers, searchUsers, updateUser, deleteUser} from "../controllers/usersController.ts";
import z from "zod";


const router = Router();

const searchSchema = z.object({
    search: z.string().min(1, "Search term must be at least 1 character long")
});

const updateUserSchema = z.object({
    username: z.string().optional(),
    email: z.email("Invalid email address").optional(),
    role: z.string().optional(),
    studentId: z.string().optional(),
    studentLRN: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters long").optional()
});

const uuidSchema = z.object({
    id: z.uuid("Invalid UUID format")
});

router.use(authAdminToken);
router.get("/all", getAllUsers);
router.get("/role/:role", getAllUserByRole);
router.get("/search", validateQuery(searchSchema), searchUsers);
router.put("/update/:id", validateParams(uuidSchema), validateBody(updateUserSchema), updateUser);
router.delete("/delete/:id", validateParams(uuidSchema), deleteUser);
export default router;