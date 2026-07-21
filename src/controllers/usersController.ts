import type { Response } from "express";
import type  {AuthenticatedRequest} from "../middlewares/authToken.ts";
import { users } from "../db/schema.ts";
import { db } from "../db/connections.ts";
import { v4 as uuid } from "uuid";
import Fuse from "fuse.js";
import { eq, desc, and } from "drizzle-orm";
import z from "zod";

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const usersList = await db.query.users.findMany({
            orderBy: desc(users.createdAt)
        });
        
        const usersWithoutPasswords = usersList.map(({password, ...userWithoutPassword}) => userWithoutPassword);
        
        console.log("Fetched users:", usersList);
        res.status(200).json({users: usersWithoutPasswords});
    }
    catch(e){
        res.status(500).json({message: "Error fetching users"});
    }
}

export const getAllUserByRole = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const role = z.string().parse(req.params.role);
        
        const userList = await db.query.users.findMany({
            where: eq(users.role, role),
            orderBy: desc(users.createdAt)
        });
        
        const usersWithoutPasswords = userList.map(({password, ...userWithoutPassword}) => userWithoutPassword);
        
        console.log("Fetched users:", usersWithoutPasswords);
        res.status(200).json({users: usersWithoutPasswords});
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid role parameter:", e.issues);
            return res.status(400).json({message: "Invalid role parameter", errors: e.issues});
        }
        
        console.error("Error fetching users:", e);
        res.status(500).json({message: "Error fetching users"});
    }
}

export const searchUsers = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const term = z.string().parse(req.query.name);
        
        const allUsers = await db.query.users.findMany({
            orderBy: desc(users.createdAt)
        });
        
        const fuse = new Fuse(allUsers, {
            keys: ["username", "email", "studentId", "studentLRN"],
            threshold: 0.3
        })
        
        const results = fuse.search(term);
        const matchedUsers = results.map(result => result.item);
        
        console.log("Search results:", matchedUsers);
        return res.status(200).json({users: matchedUsers});
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid search query:", e.issues);
            return res.status(400).json({message: "Invalid search query", errors: e.issues});
        }
        
        console.error("Error searching users:", e);
        res.status(500).json({message: "Error searching users"});
    }
}