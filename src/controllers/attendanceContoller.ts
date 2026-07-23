import type {Response} from "express";
import type {AuthenticatedRequest} from "../middlewares/authToken.ts";
import {attendance, users, events} from "../db/schema.ts";
import {db} from "../db/connections.ts";
import { eq, desc, and, or, like } from "drizzle-orm";
import { z } from "zod";
import { v4 as uuid } from "uuid";

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
                and(eq(users.id, req.body.userId), eq(events.id, req.body.eventId))
        });
        
        if (!attendanceExist) {
            return res.status(400).json({message: "Attendance already marked for this user and event"});
        }
        
        const attendanceId = uuid();
        const newAttendance = {
            ...req.body,
            id: attendanceId
        };
        
        await db.insert(attendance).values(newAttendance);
        
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
        res.status(200).json({attendance: attendanceList});
    }
    catch (e){
        console.error("Error fetching attendance:", e);
        res.status(500).json({message: "Error fetching attendance"});
    }
}


