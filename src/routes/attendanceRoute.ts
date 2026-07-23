import Router from "express";
import { markAttendance, getAllAttendance, getEventAttendance, getUserAttendance, updateAttendance} from "../controllers/attendanceContoller.ts";
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
router.get("/userId/:id", validateParams(uuidSchema), getUserAttendance);
router.get("/eventId/:id", validateParams(uuidSchema), getEventAttendance);
router.put("/update/:id", validateParams(uuidSchema), updateAttendance)


export default router