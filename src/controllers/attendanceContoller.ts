import type {Response} from "express";
import type {AuthenticatedRequest} from "../middlewares/authToken.ts";
import {attendance, users, events} from "../db/schema.ts";
import {db} from "../db/connections.ts";
import { eq, desc, and, or, like } from "drizzle-orm";
import { z } from "zod";
import { v4 as uuid } from "uuid";
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
            return res.status(400).json({message: "Attendance already marked for this user and event"});
        }
        
        const attendanceId = uuid();
        const newAttendance = {
            ...req.body,
            id: attendanceId
        };
        
        await db.insert(attendance).values(newAttendance);
        
        // Emit a socket event to notify the user that their attendance has been marked
        io.to(`userId-${req.body.userId}`).emit("attendance:marked", {
            message: "You have been marked as present!",
            eventId: req.body.eventId,
            attendance: newAttendance,
        });
        
        console.log("Attendance marked:", newAttendance);
        res.status(201).json({message: "Attendance marked successfully", attendance: newAttendance});
    }
    catch(e){
        console.error("Error marking attendance:", e);
        res.status(500).json({message: "Error marking attendance"});
    }
}


export const getAllAttendance = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const attendanceList = await db.query.attendance.findMany();
        
        console.log("Fetched attendance:", attendanceList);
        res.status(200).json({message: "Attendance fetched successfully", attendance: attendanceList});
    }
    catch (e){
        console.error("Error fetching attendance:", e);
        res.status(500).json({message: "Error fetching attendance"});
    }
}


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
        
        console.log("Fetched attendance for user:", user);
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


export const getEventAttendance = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const eventId = z.uuid().parse(req.params.id);
        const event = await db.query.attendance.findMany({
            where: eq(attendance.eventId, eventId)
        })
        
        if (!event) {
            return res.status(404).json({message: "Attendance not found for this event"});
        }
        
        console.log("Fetched attendance for event:", event);
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


export const updateAttendance = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const userId = z.uuid().parse(req.params.id);
        const isLate = z.boolean().parse(req.body.isLate);
        
        const updatedAttendance = await db.update(attendance).set({ isLate }).where(eq(attendance.userId, userId));
        
        if(updatedAttendance[0].affectedRows === 0){
            console.error("Attendance not found for user:", userId);
            return res.status(404).json({message: "Attendance not found for this user"});
        }
        console.log("Attendance updated:", updatedAttendance);
        res.status(200).json({message: "Attendance updated successfully", attendance: updatedAttendance});
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid attendance update", e.issues);
            return res.status(400).json({message: "Invalid attendance update", error: e.issues});
        }
        console.error("Error updating attendance:", e);
        res.status(500).json({message: "Error updating attendance"});
    }
}


export const deleteUserAttendance = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const userId = z.uuid().parse(req.params.id);
        const deletedUser = await db.delete(attendance).where(eq(attendance.userId, userId))
        
        if(deletedUser[0].affectedRows===0){
            console.error("User not found", userId);
            return res.status(404).json({message: "User not found"})
        }
        
        console.log("User attendance deleted successfully:", deletedUser);
        res.status(200).json({message: "User attendance deleted successfully", user: deletedUser})
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid user id", e);
            return res.status(400).json({message: "Invalid user id",error: e.issues})
        }
        
        console.error("Error deleting attendance:", e);
        res.status(500).json({message: "Error deleting attendance"})
    }
}