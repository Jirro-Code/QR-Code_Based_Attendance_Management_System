import Router from "express";
import { authAdminToken } from "../middlewares/authToken.ts";
import { validateQuery, validateBody, validateParams} from "../middlewares/validation.ts";
import z from "zod";

const router = Router();

router.use(authAdminToken);

export default router;