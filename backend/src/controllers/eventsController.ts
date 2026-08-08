import type {Response} from "express";
import type {AuthenticatedRequest} from "../middlewares/authToken.ts";
import {events, users} from "../db/schema.ts";
import {db} from "../db/connections.ts";
import { eq, desc, and, or, like } from "drizzle-orm";
import { z } from "zod";



export const createEvent = async (req: AuthenticatedRequest, res: Response) => {
    try{                
        const [newEvent] = await db.insert(events).values({
            ...req.body,
            createdBy: req.user!.id
        }).returning();
        
        res.status(201).json({message: "Event created successfully", event: newEvent});
    }
    catch(e){
        console.error("Error creating event:", e);
        res.status(500).json({message: "Error creating event"});
    }
}


export const getAllEvents = async ( _req: AuthenticatedRequest, res: Response) => {
    try{
        const eventsList = await db.select({ 
                                            eventId: events.id,
                                            eventName: events.eventName, 
                                            eventDescription: events.eventDescription, 
                                            eventDate: events.eventDate, 
                                            eventLocation: events.eventLocation,
                                            creator: users.username}).
                                            from(events).
                                            innerJoin(users, eq(events.createdBy, users.id)).
                                            orderBy(desc(events.eventDate));
        
        if(eventsList.length === 0){
            console.error("No events found");
            return res.status(404).json({message: "No events found"});
        }
        
        res.status(200).json({message: "Events retrieved successfully", events: eventsList});
    }
    catch (e){
        console.error("Error fetching events:", e);
        res.status(500).json({message: "Error fetching events"});
    }
}

export const getEventById = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const eventId = z.string().parse(req.params.id);
        const event = await db.select({ eventName: events.eventName,
                                        eventDescription: events.eventDescription,
                                        eventDate: events.eventDate,
                                        eventLocation: events.eventLocation,
                                        creator: users.username}).from(events).
                                        innerJoin(users, and(eq(events.createdBy, users.id), eq(events.id, eventId)));
        
        if(event.length === 0){
            console.error("Event not found for event ID:", eventId);
            return res.status(404).json({message: "Event not found"});
        }
        
        res.status(200).json({message: "Event retrieved successfully", event: event[0]});
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid event ID parameter:", e.issues);
            return res.status(400).json({message: "Invalid event ID parameter", errors: e.issues});
        }
        console.error("Error fetching event:", e);
        res.status(500).json({message: "Error fetching event"});
    }
};

export const searchEvents = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const term = z.string().parse(req.query.search);
        // If the term looks like a date (YYYY-MM-DD), search by exact date as well.
        const maybeDate = (() => {
            const d = new Date(term);
            return !Number.isNaN(d.getTime()) ? d.toISOString().split("T")[0] : null;
        })();
        
        const whereClause = term ? or(
            like(events.eventName, `%${term}%`),
            like(events.eventLocation, `%${term}%`),
            maybeDate ? eq(events.eventDate, maybeDate) : undefined
        ) : undefined;
        
        const eventsList = await db.select({ eventName: events.eventName,
                                            eventDescription: events.eventDescription,
                                            eventDate: events.eventDate,
                                            eventLocation: events.eventLocation,
                                            creator: users.username }).
                                            from(events).
                                            leftJoin(users, eq(events.createdBy, users.id)).
                                            where(whereClause).
                                            orderBy(desc(events.eventDate));
        
        res.status(200).json({message: "Events retrieved successfully", events: eventsList});
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


export const updateEvent = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const eventId = z.string().parse(req.params.id);
        const [updatedEvent] = await db.update(events).set({...req.body, updatedAt: new Date()}).where(eq(events.id, eventId)).returning();
        
        if(!updatedEvent){
            console.error("Event not found:", eventId);
            return res.status(404).json({message: "Event not found"});
        }
        
        console.log("Event updated:", eventId);
        res.status(200).json({message: "Event updated successfully", updates: updatedEvent});
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid event update", e.issues)
            return res.status(400).json({message: "Invalid event update", error: e.issues})
        }
        
        console.error("Error occured while updating event", e);
        res.status(500).json({message: "Error updating event"})
    }
}


export const deleteEvent = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const eventId = z.string().parse(req.params.id);
        const [deletedEvent] = await db.delete(events).where(eq(events.id, eventId)).returning();
        
        if(!deletedEvent){
            console.error("Event not found:", eventId);
            return res.status(404).json({message: "Event not found"});
        }
        
        console.log("Event deleted:", eventId);
        res.status(200).json({message: "Event deleted successfully", event: deletedEvent});
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid event ID parameter:", e.issues);
            return res.status(400).json({message: "Invalid event ID parameter", errors: e.issues});
        }
        
        console.error("Error occurred while deleting event:", e);
        res.status(500).json({message: "Error deleting event"});
    }
}
