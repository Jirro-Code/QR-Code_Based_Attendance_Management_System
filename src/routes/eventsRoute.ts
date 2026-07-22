import Router from "express";
import { authAdminToken } from "../middlewares/authToken.ts";
import { validateQuery, validateBody, validateParams} from "../middlewares/validation.ts";
import z from "zod";
import { createEvent, getAllEvents, searchEvents, updateEvent } from "../controllers/eventsController.ts";

const router = Router();


const createEventSchema = z.object({
    eventName: z.string().min(1, "Event name is required"),
    eventDescription: z.string().optional(),
    eventDate: z.coerce.date("Invalid event date").refine((date) => date >= new Date(), "Invalid date: must be today or in the future"),
    eventLocation: z.string().optional()
});


const updateEventSchema = z.object({
    eventName: z.string().min(1, "Event name is required").optional(),
    eventDescription: z.string().optional(),
    eventDate: z.coerce.date("Invalid event date").refine((date) => date >= new Date(), "Invalid date: must be today or in the future").optional(),
    eventLocation: z.string().optional()
});


const searchSchema = z.object({
    search: z.string().min(1, "Search term must be at least 1 character long")
});


const uuidSchema = z.object({
    id: z.string().uuid("Invalid UUID format")
});


router.use( authAdminToken );
router.post("/create", validateBody(createEventSchema), createEvent);
router.get("/all", getAllEvents);
router.get("/search", validateQuery(searchSchema), searchEvents);
router.put("/update/:id", validateParams(uuidSchema), validateBody(updateEventSchema), updateEvent);


export default router;