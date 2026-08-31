import Router from "express";
import { markAttendance, getEventAttendanceByStrand, getEventAttendanceByEventId, getAllArchivedEventAttendance, getAttendanceByStrand, getUserAttendance, updateAttendance, unarchiveAttendance,  archiveAttendance, getAllEventAttendance, checkAttendance} from "../controllers/attendanceContoller.ts";
import { authAdminToken, authToken} from "../middlewares/authToken.ts";
import { insertAttendanceSchema } from "../db/schema.ts";
import { validateBody, validateParams } from "../middlewares/validation.ts";
import { userStrandSchema } from "../db/schema.ts";
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
    groupStrand: userStrandSchema
});

const strandSchema = z.object({
    strand: userStrandSchema
});

const doubleUuidSchema = z.object({
    eventId: z.uuid("Invalid UUID format"),
    userId: z.uuid("Invalid UUID format")
});

router.use(authToken);
router.get("/myAttendance", getUserAttendance);

router.use(authAdminToken);
router.get("/checkAttendance/:eventId/:userId", validateParams(doubleUuidSchema), checkAttendance);
router.post("/mark", validateBody(insertAttendanceSchema), markAttendance);
router.get("/allEvents", getAllEventAttendance);
router.get("/allArchivedEvents", getAllArchivedEventAttendance);
router.get("/userId/:id", validateParams(uuidSchema), getUserAttendance);
router.get("/eventId/:id", validateParams(uuidSchema), getEventAttendanceByEventId);
router.get("/strand/:strand", validateParams(strandSchema), getEventAttendanceByStrand);
router.get("/groupStrand/:groupStrand/eventId/:eventId", validateParams(groupStrandSchema), getAttendanceByStrand);
router.put("/update/:id", validateParams(uuidSchema), validateBody(updateSchema), updateAttendance)
router.patch("/unarchive/:id", validateParams(uuidSchema), unarchiveAttendance);
router.patch("/archive/:id", validateParams(uuidSchema), archiveAttendance);

export default router