import Router from "express";
import { markAttendance, getAttendanceByEventId, getUserAttendance, updateAttendance, unarchiveAttendance,  archiveAttendance, checkAttendance, getEventWithAttendanceByStrandAndSection, getAllEventWithAttendance, getAllArchivedEventWithAttendance} from "../controllers/attendanceContoller.ts";
import { authAdminToken, authToken} from "../middlewares/authToken.ts";
import { insertAttendanceSchema } from "../db/schema.ts";
import { validateBody, validateParams, validateQuery } from "../middlewares/validation.ts";
import { userStrandSchema } from "../db/schema.ts";
import z from "zod";


const router = Router();

const uuidSchema = z.object({
    id: z.uuid("Invalid UUID format")
});

const updateSchema = z.object({
    isLate: z.boolean("isLate must be true or false")
})

const strandSchema = z.object({
    strand: userStrandSchema.optional(),
    section: z.string().optional()
});

const doubleUuidSchema = z.object({
    eventId: z.uuid("Invalid UUID format"),
    userId: z.uuid("Invalid UUID format")
});


router.use(authToken);
router.get("/userId/:id", validateParams(uuidSchema), getUserAttendance);

router.use(authAdminToken);
router.get("/checkAttendance/:eventId/:userId", validateParams(doubleUuidSchema), checkAttendance);
router.post("/mark", validateBody(insertAttendanceSchema), markAttendance);
router.get("/allEvents", getAllEventWithAttendance);
router.get("/allArchivedEvents", getAllArchivedEventWithAttendance);
router.get("/eventId/:id", validateParams(uuidSchema), getAttendanceByEventId);
router.get("/filter", validateQuery(strandSchema), getEventWithAttendanceByStrandAndSection);
router.put("/update/:id", validateParams(uuidSchema), validateBody(updateSchema), updateAttendance)
router.patch("/unarchive/:id", validateParams(uuidSchema), unarchiveAttendance);
router.patch("/archive/:id", validateParams(uuidSchema), archiveAttendance);

export default router