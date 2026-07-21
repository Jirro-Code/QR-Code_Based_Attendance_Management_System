import Router from "express";
import {authToken} from "../middlewares/authToken.ts";
import { getAllUserByRole, getAllUsers } from "../controllers/usersController.ts";
import z from "zod";


const router = Router();


router.use(authToken);
router.get("/api/users", getAllUsers);
router.get("/api/users/role/:role", getAllUserByRole);

export default router;