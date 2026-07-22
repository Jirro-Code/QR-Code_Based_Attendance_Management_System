import Router from "express";
import { authAdminToken } from "../middlewares/authToken.ts";
import { validateQuery, validateBody, validateParams} from "../middlewares/validation.ts";
import z from "zod";
import { createEvent } from "../controllers/eventsController.ts";

const router = Router();

const createEventSchema = z.object({
    eventName: z.string().min(1, "Event name is required"),
    eventDescription: z.string().optional(),
    eventDate: z.coerce.date("Invalid event date").refine((date) => date >= new Date(), "Invalid date: must be today or in the future"),
    eventLocation: z.string().optional()
});

router.use( authAdminToken );
router.post("/create", validateBody(createEventSchema), createEvent);

export default router;