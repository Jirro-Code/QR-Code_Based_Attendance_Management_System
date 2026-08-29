import type {Response} from "express";
import type {AuthenticatedRequest} from "../middlewares/authToken.ts";
import {attendance, users, events} from "../db/schema.ts";
import {db} from "../db/connections.ts";
import { eq, desc, and, or} from "drizzle-orm";
import { z } from "zod";
import { io } from "../index.ts";

export const markAttendance = async (req: AuthenticatedRequest, res: Response) => {
    try{      
        const studentExist = await db.query.users.findFirst({
            where: 
                eq(users.id, req.body.userId)
        });
        
        if (!studentExist) {
            return res.status(404).json({message: "Student not found"});
        }
        
        if (studentExist.role !== "user") {
            return res.status(400).json({message: "User is not a student"});
        }
        
        if (studentExist.isArchived) {
            return res.status(400).json({message: "Student is archived"});
        }
        
        const eventExist = await db.query.events.findFirst({
            where:
                eq(events.id, req.body.eventId)
        });
        
        if (!eventExist) {
            return res.status(404).json({message: "Event not found"});
        }
        
        const attendanceExist = await db.query.attendance.findFirst({
            where: 
                and(eq(attendance.userId, req.body.userId), eq(attendance.eventId, req.body.eventId))
        });
        
        if (attendanceExist) {
            return res.status(409).json({message: "Attendance already marked for this user and event"});
        }
        
        const newAttendance = {
            ...req.body
        };
        
        await db.insert(attendance).values(newAttendance);
        
        // Emit a socket event to notify the user that their attendance has been marked
        io.to(`userId-${req.body.userId}`).emit("attendance:marked", {
            message: "You have been marked as present!",
            eventId: req.body.eventId,
            attendance: newAttendance,
        });
        
        res.status(201).json({message: "Attendance marked successfully", attendance: newAttendance});
    }
    catch(e){
        console.error("Error marking attendance:", e);
        res.status(500).json({message: "Error marking attendance"});
    }
}


export const getAllEventAttendance = async (_req: AuthenticatedRequest, res: Response) => {
    try {
        const attendanceList = await db.query.attendance.findMany({
            where: and(eq(attendance.isArchived, false), eq(attendance.isArchivedByEvent, false), eq(attendance.isArchivedByStudent, false)),
            with: {
                event: true,
            },
        });
        
        const nonDuplicateEvents = new Map();
        
        for (const record of attendanceList) {
            if (!nonDuplicateEvents.has(record.eventId)) {
                nonDuplicateEvents.set(record.eventId, record.event);
            }
        }
        
        const events = Array.from(nonDuplicateEvents.values());
        
        if (events.length === 0) {
            return res.status(404).json({ message: "No events found" });
        }
        
        res.status(200).json({ message: "Attendance fetched successfully", events: events });
    } 
    catch (e) {
        console.error("Error fetching attendance:", e);
        res.status(500).json({ message: "Error fetching attendance" });
    }
};


export const getAllArchivedEventAttendance = async (_req: AuthenticatedRequest, res: Response) => {
    try {
        const archivedAttendanceList = await db.query.attendance.findMany({
            where: or(eq(attendance.isArchivedByEvent, true), eq(attendance.isArchivedByStudent, true), eq(attendance.isArchived, true)),
            with: {
                event: true,
            },
        });
        
        const nonDuplicateEvents = new Map();
        
        for (const record of archivedAttendanceList) {
            if (!nonDuplicateEvents.has(record.eventId)) {
                nonDuplicateEvents.set(record.eventId, record.event);
            }
        }
        
        const events = Array.from(nonDuplicateEvents.values());
        
        if (events.length === 0) {
            return res.status(404).json({ message: "No archived attendance found" });
        }
        
        res.status(200).json({ message: "Archived events attendance fetched successfully", events: events });
    } catch (e) {
        console.error("Error fetching archived events attendance:", e);
        res.status(500).json({ message: "Error fetching events archived attendance" });
    }
};


export const getUserAttendance = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const userId = req.user!.role === "admin" ? z.uuid().parse(req.params.id) : req.user!.id;
        
        const user = await db.query.attendance.findMany({
            where: eq(attendance.userId, userId),
            orderBy: desc(attendance.attendedAt)
        })
        
        if (!user) {
            return res.status(404).json({message: "Attendance not found for this user"});
        }
        
        res.status(200).json({message: "Attendance fetched successfully", attendance: user});
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid user ID:", e.issues);
            return res.status(400).json({message: "Invalid user ID", errors: e.issues});
        }
        
        console.error("Error fetching attendance by ID:", e);
        res.status(500).json({message: "Error fetching attendance by ID"});
    }
}



export const getEventAttendanceByEventId = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const eventId = z.uuid().parse(req.params.id);
        const event = await db.query.attendance.findMany({
            where: eq(attendance.eventId, eventId)
        })
        
        if (!event) {
            return res.status(404).json({message: "Attendance not found for this event"});
        }
        
        res.status(200).json({message: "Attendance fetched successfully", attendance: event});
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid event ID:", e.issues);
            return res.status(400).json({message: "Invalid event ID", errors: e.issues});
        }
        
        console.error("Error fetching attendance by ID:", e);
        res.status(500).json({message: "Error fetching attendance by ID"});
    }
}


export const getAttendanceByStrand = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const eventId = z.uuid().parse(req.params.eventId);
        const groupStrand = z.enum(["ICT", "HRCTO", "GAS", "HUMSS", "ABM", "STEM", "AAD"]).parse(req.params.groupStrand);
        
        const eventExist = await db.query.events.findFirst({
            where: eq(events.id, eventId)
        });
        
        if (!eventExist) {
            return res.status(404).json({message: "Event not found"});
        }
        
        const groupAttendance = await 
            db.select({
                id: attendance.id, 
                userId: attendance.userId, 
                eventId: attendance.eventId, 
                isLate: attendance.isLate, 
                attendedAt: attendance.attendedAt,
                isArchived: attendance.isArchived,
                isArchivedByEvent: attendance.isArchivedByEvent,
                isArchivedByStudent: attendance.isArchivedByStudent,
            }).
            from(attendance).
            innerJoin(users, eq(attendance.userId, users.id)).
            where(and(eq(attendance.eventId, eventId), eq(users.studentStrand, groupStrand)));
        
        if (groupAttendance.length === 0) {
            return res.status(404).json({message: "Attendance not found for this group"});
        }
        
        res.status(200).json({message: "Attendance fetched successfully", attendance: groupAttendance});
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid group parameters:", e.issues);
            return res.status(400).json({message: "Invalid group parameters", errors: e.issues});
        }
        res.status(500).json({message: "Error fetching attendance by group", error: e});
    }
}


export const getEventAttendanceByStrand = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const strand = z.enum(["ICT", "HRCTO", "GAS", "HUMSS", "ABM", "STEM", "AAD"]).parse(req.params.strand);
        const archived = req.query.archived === "true";
        
        const archivedCondition = archived ? or(eq(attendance.isArchivedByEvent, true), eq(attendance.isArchivedByStudent, true), eq(attendance.isArchived, true)) : and(eq(attendance.isArchived, false), eq(attendance.isArchivedByEvent, false));
        
        const eventsByStrand = await db
            .selectDistinct({id: events.id, eventName: events.eventName, eventDate: events.eventDate})
            .from(events)
            .innerJoin(attendance, eq(attendance.eventId, events.id))
            .innerJoin(users, eq(users.id, attendance.userId))
            .where(and(archivedCondition, eq(users.studentStrand, strand)));
        
        if (eventsByStrand.length === 0) {
            return res.status(404).json({message: "No events found for this strand"});
        }
        
        res.status(200).json({message: "Events fetched successfully", events: eventsByStrand});
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid group parameters:", e.issues);
            return res.status(400).json({message: "Invalid group parameters", errors: e.issues});
        }
        res.status(500).json({message: "Error fetching events by group", error: e});
    }
}


export const updateAttendance = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const attendanceId = z.uuid().parse(req.params.id);
        const isLate = z.boolean().parse(req.body.isLate);
        
        const [updatedAttendance] = await db.update(attendance).set({ isLate }).where(eq(attendance.id, attendanceId)).returning();
        
        if (!updatedAttendance) {
            console.error("Attendance not found:", attendanceId);
            return res.status(404).json({ message: "Attendance not found" });
        }
        
        res.status(200).json({ message: "Attendance updated successfully", attendance: updatedAttendance });
    }
    catch (e) {
        if (e instanceof z.ZodError) {
            console.error("Invalid attendance update", e.issues);
            return res.status(400).json({ message: "Invalid attendance update", error: e.issues });
        }
        
        console.error("Error updating attendance:", e);
        res.status(500).json({ message: "Error updating attendance" });
    }
}

export const unarchiveAttendance = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const attendanceId = z.uuid().parse(req.params.id);
        const [unarchivedAttendance] = await db.update(attendance).set({ isArchived: false }).where(eq(attendance.id, attendanceId)).returning();
        
        const checkAttendance = await db.query.attendance.findFirst({
            where: eq(attendance.id, attendanceId)
        });
        
        if(!checkAttendance) {
            console.error("Attendance not found", attendanceId);
            return res.status(404).json({message: "Attendance not found"});
        }
        
        const isEventArchived = checkAttendance?.isArchivedByEvent ?? false;
        
        if (isEventArchived) {
            return res.status(400).json({message: "Cannot unarchive attendance because the event is archived"});
        }
        
        const isUserArchived = checkAttendance?.isArchivedByStudent ?? false;
        
        if (isUserArchived) {
            return res.status(400).json({message: "Cannot unarchive attendance because the user is archived"});
        }
        
        const isAttendanceArchived = checkAttendance?.isArchived ?? false;
        
        if (!isAttendanceArchived) {
            return res.status(400).json({message: "Attendance is not archived"});
        }
        
        res.status(200).json({message: "User attendance unarchived successfully", user: unarchivedAttendance})
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid user id", e);
            return res.status(400).json({message: "Invalid user id",error: e.issues})
        }
        
        console.error("Error archiving attendance:", e);
        res.status(500).json({message: "Error archiving attendance"})
    }
}

export const archiveAttendance = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const attendanceId = z.uuid().parse(req.params.id);
        
        const checkAttendance = await db.query.attendance.findFirst({
            where: eq(attendance.id, attendanceId)
        });
        
        if(!checkAttendance) {
            console.error("Attendance not found", attendanceId);
            return res.status(404).json({message: "Attendance not found"})
        }
        
        if(checkAttendance?.isArchived){
            return res.status(400).json({message: "Attendance is already archived"});
        }
        
        const [archivedAttendance] = await db.update(attendance).set({ isArchived: true }).where(eq(attendance.id, attendanceId)).returning();
        
        res.status(200).json({message: "User attendance archived successfully", user: archivedAttendance})
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid user id", e);
            return res.status(400).json({message: "Invalid user id",error: e.issues})
        }
        
        console.error("Error archiving attendance:", e);
        res.status(500).json({message: "Error archiving attendance"})
    }
}