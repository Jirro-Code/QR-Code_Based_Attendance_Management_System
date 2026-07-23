import Router from "express";
import { markAttendance, getAllAttendance, getAttendanceByUserId} from "../controllers/attendanceContoller.ts";
import { authAdminToken } from "../middlewares/authToken.ts";
import { insertAttendanceSchema } from "../db/schema.ts";
import { validateBody, validateParams } from "../middlewares/validation.ts";
import z from "zod";


const router = Router();

const uuidSchema = z.object({
    id: z.uuid("Invalid UUID format")
});

router.use(authAdminToken);
router.post("/mark", validateBody(insertAttendanceSchema), markAttendance);
router.get("/all", getAllAttendance);
router.get("/userId/:id", validateParams(uuidSchema), getAttendanceByUserId);


export default router