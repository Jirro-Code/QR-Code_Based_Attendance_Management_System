import type { Response } from "express";
import type  {AuthenticatedRequest} from "../middlewares/authToken.ts";
import { users, userRoleSchema } from "../db/schema.ts";
import { db } from "../db/connections.ts";
import { hashPassword } from "../utils/password.ts";
import { eq, and, or, ilike, desc} from "drizzle-orm";
import z from "zod";


export const getSelf = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const userId = z.string().parse(req.user!.id);
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });
        
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        
        const {password, ...userWithoutPassword} = user;
        
        res.status(200).json({message: "User retrieved successfully", user: userWithoutPassword});
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid user ID parameter:", e.issues);
            return res.status(400).json({message: "Invalid user ID parameter", errors: e.issues});
        }
        
        console.error("Error fetching user:", e);
        res.status(500).json({message: "Error fetching user"});
    }
}

export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const userId = z.string().parse(req.params.id);
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });
        
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        
        const {password, ...userWithoutPassword} = user;
        
        res.status(200).json({message: "User retrieved successfully", user: userWithoutPassword});
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid user ID parameter:", e.issues);
            return res.status(400).json({message: "Invalid user ID parameter", errors: e.issues});
        }
        console.error("Error fetching user:", e);
        res.status(500).json({message: "Error fetching user"});
    }
}

export const getAllUserByRole = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const role = userRoleSchema.parse(req.params.role);
        
        const userList = await db.query.users.findMany({
            where: eq(users.role, role),
            orderBy: desc(users.updatedAt)
        });
        
        if(userList.length === 0){
            console.error("No users found for role:", role);
            return res.status(404).json({message: "No users found for role"});
        }
        
        const usersWithoutPasswords = userList.map(({password, ...userWithoutPassword}) => userWithoutPassword);
        
        res.status(200).json({message: "Users retrieved successfully", users: usersWithoutPasswords});
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
                        ilike(users.username, `%${term}%`),
                        ilike(users.email, `%${term}%`),
                        ilike(users.studentId, `%${term}%`),
                        ilike(users.studentLRN, `%${term}%`)
                    ) : undefined
                ),
                orderBy: desc(users.updatedAt)
            }
        );
        
        if(usersList.length === 0){
            console.error("No users found matching the search query:", term);
            return res.status(404).json({message: "No users found matching the search query"});
        }
        
        const matchedUsers = usersList.map(({password, ...userWithoutPassword}) => userWithoutPassword);
        
        return res.status(200).json({message: "Users retrieved successfully", users: matchedUsers});
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
        const updatedData = userPassword ? {...req.body, password: userPassword, updatedAt: new Date()} : {...req.body, updatedAt: new Date()};
        const [updatedUser] = await db.update(users).set(updatedData).where(eq(users.id, userId)).returning();
        
        if(!updatedUser) {
            return res.status(404).json({message: "User not found"});
        }
        
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
        const [deletedUser] = await db.delete(users).where(eq(users.id, userId)).returning();
        
        if(!deletedUser) {
            console.error("User not found or unauthorized to delete");
            return res.status(404).json({message: "User not found or unauthorized to delete"});
        }
        
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