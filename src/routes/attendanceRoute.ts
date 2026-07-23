import Router from "express";
import { markAttendance, getAllAttendance} from "../controllers/attendanceContoller.ts";
import { authAdminToken } from "../middlewares/authToken.ts";
import { insertAttendanceSchema } from "../db/schema.ts";
import { validateBody } from "../middlewares/validation.ts";
import z from "zod";


const router = Router();

router.use(authAdminToken);
router.post("/mark", validateBody(insertAttendanceSchema), markAttendance);
router.get("/all", getAllAttendance);

export default router