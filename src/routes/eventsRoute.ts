import Router from "express";
import { authAdminToken } from "../middlewares/authToken.ts";
import { validateQuery, validateBody, validateParams} from "../middlewares/validation.ts";
import z from "zod";
import { createEvent, getAllEvents, searchEvents } from "../controllers/eventsController.ts";

const router = Router();

const createEventSchema = z.object({
    eventName: z.string().min(1, "Event name is required"),
    eventDescription: z.string().optional(),
    eventDate: z.coerce.date("Invalid event date").refine((date) => date >= new Date(), "Invalid date: must be today or in the future"),
    eventLocation: z.string().optional()
});

const searchSchema = z.object({
    search: z.string().min(1, "Search term must be at least 1 character long")
});

router.use( authAdminToken );
router.post("/create", validateBody(createEventSchema), createEvent);
router.get("/all", getAllEvents);
router.get("/search", validateQuery(searchSchema), searchEvents);

export default router;