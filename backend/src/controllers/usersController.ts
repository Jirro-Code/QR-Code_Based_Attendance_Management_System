import type { Response } from "express";
import type  {AuthenticatedRequest} from "../middlewares/authToken.ts";
import { users, attendance, userRoleSchema } from "../db/schema.ts";
import { db } from "../db/connections.ts";
import { comparePassword, hashPassword } from "../utils/password.ts";
import { eq, and, or, ilike, desc, not} from "drizzle-orm";
import z from "zod";
import { generateProfilePictureSASUrl, updateProfilePicture, uploadProfilePicture } from "../services/azureBlob.ts";


export const getSelf = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const userId = z.string().parse(req.user!.id);
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });
        
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        
        if(user.isArchived === true){
            return res.status(403).json({message: "User is archived"});
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

export const getProfilePictureById = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const userId = z.string().parse(req.params.id);
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });
        
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        
        if(!user.profilePictureUrl) {
            return res.status(404).json({message: "Profile picture not found"});
        }
        
        const sasUrl = generateProfilePictureSASUrl(user.profilePictureUrl);
        res.status(200).json({message: "Profile picture retrieved successfully", url: sasUrl});
    }
    catch(e){
        console.error("Error fetching profile picture:", e);
        res.status(500).json({message: "Error fetching profile picture"});
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
    try {
        
        const updateUserSchema = z.object({
            username: z.string().min(1).optional(),
            email: z.string().email().optional(),
            studentId: z.string().min(1).optional(),
            studentLRN: z.string().min(1).optional(),
            password: z.string().min(6).optional(),
            currentPassword: z.string().min(1).optional(),
        });
        
        const userId = z.string().parse(req.params.id);
        const profilePicture = req.file;
        
        const body = updateUserSchema.parse(req.body ?? {});
        const { password: rawPassword, currentPassword, ...safeBody } = body;
        const userPassword = rawPassword ? await hashPassword(rawPassword) : undefined;
        
        const existingUser = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (rawPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: "Current password is required to change the password" });
            }
            
            const isCurrentPasswordValid = await comparePassword(currentPassword, existingUser.password);
            if (!isCurrentPasswordValid) {
                return res.status(401).json({ message: "Current password is incorrect" });
            }
        }
        
        const [emailConflict, studentIdConflict, studentLRNConflict] = await Promise.all([
            body.email
                ? db.query.users.findFirst({ where: and(not(eq(users.id, userId)), eq(users.email, body.email)) })
                : null,
            body.studentId
                ? db.query.users.findFirst({ where: and(not(eq(users.id, userId)), eq(users.studentId, body.studentId)) })
                : null,
            body.studentLRN
                ? db.query.users.findFirst({ where: and(not(eq(users.id, userId)), eq(users.studentLRN, body.studentLRN)) })
                : null,
        ]);
        
        const duplicateFields: string[] = [];
        if (emailConflict) duplicateFields.push("email");
        if (studentIdConflict) duplicateFields.push("studentId");
        if (studentLRNConflict) duplicateFields.push("studentLRN");
        
        if (duplicateFields.length > 0) {
            return res.status(409).json({
                message: `Duplicate data found for: ${duplicateFields.join(", ")}`,
                duplicateFields,
            });
        }
        
        let newBlobName: string | undefined;
        if (profilePicture) {
            newBlobName = existingUser.profilePictureUrl
                ? await updateProfilePicture(existingUser.profilePictureUrl, profilePicture)
                : await uploadProfilePicture(profilePicture);
        }
        
        const [updated] = await db
            .update(users)
            .set({
                ...safeBody,
                ...(userPassword && { password: userPassword }),
                ...(newBlobName && { profilePictureUrl: newBlobName }),
                updatedAt: new Date(),
            })
            .where(eq(users.id, userId))
            .returning();
        
        if (!updated) {
            return res.status(500).json({ message: "Failed to update user" });
        }
        
        const { password, ...userWithoutPassword } = updated;
        res.status(200).json({ message: "User updated successfully", user: userWithoutPassword });
    } 
    catch (e) {
        if (e instanceof z.ZodError) {
            console.error("Invalid input:", e.issues);
            return res.status(400).json({ message: "Invalid input", errors: e.issues });
        }
        console.error("Error updating user:", e);
        res.status(500).json({ message: "Error updating user" });
    }
};

export const resetPassword = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const email = z.string().email().parse(req.params.email);
        const newPassword = z.string().min(6).parse(req.body.password);
        
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });
        
        if (!user) {
            console.error("User not found for email:", email);
            return res.status(404).json({ message: "User not found" });
        }
        
        if(user.isArchived){
            return res.status(403).json({message: "This account is archived. Please contact the administrator."});
        }
        
        const hashedPassword = await hashPassword(newPassword);
        
        await db.update(users).set({ password: hashedPassword, updatedAt: new Date() }).where(eq(users.email, email)).returning();
        
        res.status(200).json({ message: "Password reset successfully"});
    } 
    catch (e) {
        if (e instanceof z.ZodError) {
            console.error("Invalid input for password reset:", e.issues);
            return res.status(400).json({ message: "Invalid input", errors: e.issues });
        }
        console.error("Error resetting user password:", e);
        res.status(500).json({ message: "Error resetting user password" });
    }
};

export const unarchiveUser = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const userId = z.string().parse(req.params.id);
        
        const checkUser = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });
        
        if(!checkUser) {
            console.error("User not found:", userId);
            return res.status(404).json({message: "User not found"});
        }
        
        if(checkUser?.isArchived === false){
            return res.status(400).json({message: "User is not archived"});
        }
        
        const [unarchivedUser] = await db.transaction(async (tx) => {
            await tx.update(attendance).set({ isArchivedByStudent: false }).where(eq(attendance.userId, userId)).returning();
            return await tx.update(users).set({ isArchived: false }).where(eq(users.id, userId)).returning();
        });
        
        res.status(200).json({message: "User unarchived successfully", user: unarchivedUser});
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid user ID parameter:", e.issues);
            return res.status(400).json({message: "Invalid user ID parameter", errors: e.issues});
        }
        console.error("Error unarchiving user:", e);
        res.status(500).json({message: "Error unarchiving user"});
    }
}

export const archiveUser = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const userId = z.string().parse(req.params.id);
        
        const checkUser = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });
        
        if(!checkUser) {
            console.error("User not found:", userId);
            return res.status(404).json({message: "User not found"});
        }
        
        if(checkUser?.isArchived){
            return res.status(400).json({message: "User is already archived"});
        }
        
        const [archivedUser] = await db.transaction(async (tx) => {
            await tx.update(attendance).set({ isArchivedByStudent: true }).where(eq(attendance.userId, userId)).returning();
            return await tx.update(users).set({ isArchived: true }).where(eq(users.id, userId)).returning();
        });
        
        
        res.status(200).json({message: "User archived successfully", user: archivedUser});
    }
    catch(e){
        if(e instanceof z.ZodError){
            console.error("Invalid user ID parameter:", e.issues);
            return res.status(400).json({message: "Invalid user ID parameter", errors: e.issues});
        }
        console.error("Error archiving user:", e);
        res.status(500).json({message: "Error archiving user"});
    }
}