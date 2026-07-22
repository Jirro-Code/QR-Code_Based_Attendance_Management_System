import type {Response} from "express";
import type {AuthenticatedRequest} from "../middlewares/authToken.ts";
import {events, users} from "../db/schema.ts";
import {db} from "../db/connections.ts";
import { eq, desc, and, or, like } from "drizzle-orm";
import { z } from "zod";
import { v4 as uuid } from "uuid";

export const createEvent = async (req: AuthenticatedRequest, res: Response) => {
    try{        
        const eventId = uuid();
        
        const newEvent = {
            ...req.body,
            id: eventId,
            createdBy: req.user!.id
        };
        
        await db.insert(events).values(newEvent);
        
        console.log("Event created:", newEvent);
        res.status(201).json({message: "Event created successfully", event: newEvent});
    }
    catch(e){
        console.error("Error creating event:", e);
        res.status(500).json({message: "Error creating event"});
    }
}


export const getAllEvents = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const eventsList = await db.query.events.findMany({
            orderBy: desc(events.eventDate)
        });
        
        console.log("Fetched events:", eventsList);
        res.status(200).json({events: eventsList});
    }
    catch (e){
        console.error("Error fetching events:", e);
        res.status(500).json({message: "Error fetching events"});
    }
}


export const searchEvents = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const term = z.string().parse(req.query.search);
        
        const eventsList = await db.query.events.findMany({
                where: and(
                    term ? or(
                        like(events.eventName, `%${term}%`),
                        like(events.eventDate, `%${term}%`),
                        like(events.eventLocation, `%${term}%`)
                    ) : undefined
                )
            }
        );
        
        console.log("Search results:", eventsList);
        return res.status(200).json({events: eventsList});
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid search query:", e.issues);
            return res.status(400).json({message: "Invalid search query", errors: e.issues});
        }
        
        console.error("Error searching events:", e);
        res.status(500).json({message: "Error searching events"});
    }
}