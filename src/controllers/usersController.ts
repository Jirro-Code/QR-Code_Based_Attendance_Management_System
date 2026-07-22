import type { Response } from "express";
import type  {AuthenticatedRequest} from "../middlewares/authToken.ts";
import { users } from "../db/schema.ts";
import { db } from "../db/connections.ts";
import { hashPassword } from "../utils/password.ts";
import { eq, desc, and, or, like} from "drizzle-orm";
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
        const term = z.string().parse(req.query.search);
        
        const usersList = await db.query.users.findMany({
                where: and(
                    term ? or(
                        like(users.username, `%${term}%`),
                        like(users.email, `%${term}%`),
                        like(users.studentId, `%${term}%`),
                        like(users.studentLRN, `%${term}%`)
                    ) : undefined
                )
            }
        );
        
        const matchedUsers = usersList.map(({password, ...userWithoutPassword}) => userWithoutPassword);
        
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


export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const userId = z.string().parse(req.params.id);
        const userPassword = req.body.password ? await hashPassword(req.body.password) : undefined;
        const updatedData = userPassword ? {...req.body, password: userPassword} : req.body;
        const updatedUser = await db.update(users).set(updatedData).where(eq(users.id, userId));
        
        if(updatedUser[0].affectedRows === 0) {
            return res.status(404).json({message: "User not found"});
        }
        
        console.log("Updated user:", updatedUser);
        res.status(200).json({message: "User updated successfully", user: updatedUser});
    }
    catch(e){
        console.error("Error updating user:", e);
        res.status(500).json({message: "Error updating user"});
    }
}


export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const userId = z.string().parse(req.params.id);
        const deletedUser = await db.delete(users).where(eq(users.id, userId));

        if(deletedUser[0].affectedRows === 0) {
            console.error("User not found or unauthorized to delete");
            return res.status(404).json({message: "User not found or unauthorized to delete"});
        }

        console.log("Deleted user:", deletedUser);
        res.status(200).json({message: "User deleted successfully", user: deletedUser});
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid user ID parameter:", e.issues);
            return res.status(400).json({message: "Invalid user ID parameter", errors: e.issues});
        }
        console.error("Error deleting user:", e);
        res.status(500).json({message: "Error deleting user"});
    }
}