import Router from "express";
import { markAttendance, getAllAttendance, getEventAttendance, getAttendanceByStrand, getUserAttendance, updateAttendance, deleteUserAttendance} from "../controllers/attendanceContoller.ts";
import { authAdminToken, authToken} from "../middlewares/authToken.ts";
import { insertAttendanceSchema } from "../db/schema.ts";
import { validateBody, validateParams } from "../middlewares/validation.ts";
import z from "zod";


const router = Router();

const uuidSchema = z.object({
    id: z.uuid("Invalid UUID format")
});

const updateSchema = z.object({
    isLate: z.boolean("isLate must be true or false")
})

const groupStrandSchema = z.object({
    eventId: z.uuid("Invalid UUID format"),
    groupStrand: z.enum(["ICT", "HRCTO", "GAS", "HUMSS", "ABM", "STEM", "AAD"], "Invalid strand")
});

router.use(authToken);
router.get("/myAttendance", getUserAttendance);

router.use(authAdminToken);
router.post("/mark", validateBody(insertAttendanceSchema), markAttendance);
router.get("/all", getAllAttendance);
router.get("/userId/:id", validateParams(uuidSchema), getUserAttendance);
router.get("/eventId/:id", validateParams(uuidSchema), getEventAttendance);
router.get("/groupStrand/:groupStrand/eventId/:eventId", validateParams(groupStrandSchema), getAttendanceByStrand);
router.put("/update/:id", validateParams(uuidSchema), validateBody(updateSchema), updateAttendance)
router.delete("/delete/:id", validateParams(uuidSchema), deleteUserAttendance);

export default router