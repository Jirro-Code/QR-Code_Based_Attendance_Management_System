import Router from "express";
import { authAdminToken, authToken } from "../middlewares/authToken.ts";
import { validateQuery, validateBody, validateParams} from "../middlewares/validation.ts";
import { getUserById, getAllUserByRole, getSelf, searchUsers, updateUser, archiveUser, unarchiveUser } from "../controllers/usersController.ts";
import { userStrandSchema } from "../db/schema.ts";
import z from "zod";

const router = Router();


const searchSchema = z.object({
    search: z.string().min(1, "Search term must be at least 1 character long")
});


const updateUserSchema = z.object({
    username: z.string().optional(),
    email: z.email("Invalid email address").optional(),
    studentId: z.string().optional(),
    studentLRN: z.string().optional(),
    studentStrand: userStrandSchema.optional(),
    studentSection: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters long").optional()
});


const uuidSchema = z.object({
    id: z.uuid("Invalid UUID format")
});


router.use(authToken);
router.get("/me", getSelf);


router.use(authAdminToken);
router.get("/userId/:id", getUserById);
router.get("/role/:role", getAllUserByRole);
router.get("/search", validateQuery(searchSchema), searchUsers);
router.put("/update/:id", validateParams(uuidSchema), validateBody(updateUserSchema), updateUser);
router.patch("/archive/:id", validateParams(uuidSchema), archiveUser);
router.patch("/unarchive/:id", validateParams(uuidSchema), unarchiveUser);


export default router;