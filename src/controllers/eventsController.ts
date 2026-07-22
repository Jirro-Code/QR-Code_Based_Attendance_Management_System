import type {Response} from "express";
import type {AuthenticatedRequest} from "../middlewares/authToken.ts";
import {events, users} from "../db/schema.ts";
import {db} from "../db/connections.ts";
import { eq, desc, and, or, like } from "drizzle-orm";
import { z } from "zod";
import { v4 as uuid } from "uuid";

export const createEvent = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const userId = z.string().parse(req.user!.id);
        const eventId = uuid();
        
        const newEvent = {
            ...req.body,
            id: eventId,
            userId: userId
        };
        
        await db.insert(events).values(newEvent);
        
        console.log("Event created:", newEvent);
        res.status(201).json({message: "Event created successfully", event: newEvent});
    }
    catch(e){
        res.status(500).json({message: "Error creating event"});
    }
}

