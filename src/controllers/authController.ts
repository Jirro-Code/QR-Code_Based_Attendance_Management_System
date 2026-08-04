import {users, type NewUser} from "../db/schema.ts";
import type {Request, Response} from "express";
import {db} from "../db/connections.ts";
import { comparePassword, hashPassword } from "../utils/password.ts";
import { generateToken } from "../utils/jwt.ts";
import { eq } from "drizzle-orm";
import { env } from "../../env.ts";
import ms from "ms";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ms(env.JWT_EXPIRES_IN as ms.StringValue)
};

export const registerUser = async (req: Request<any, any, NewUser>, res: Response) => {
    try{
        
        if(req.body.role === "user" && (req.body.studentId === undefined || req.body.studentLRN === undefined || req.body.studentStrand === undefined || req.body.studentSection === undefined)){
            console.error("Missing required fields for user role:", req.body);
            return res.status(400).json({message: "Missing required fields for user role"});
        }
        
        const hashedPassword = await hashPassword(req.body.password);
        
        const [newUser] = await db
        .insert(users)
        .values({
            ...req.body,
            password: hashedPassword
        }).returning({
            id: users.id,
            username: users.username,
            email: users.email,
            role: users.role
        });
        
        const token = await generateToken({
            id: newUser!.id,
            username: newUser!.username,
            email: newUser!.email,
            role: newUser!.role
        })
        
        res.cookie("token", token, cookieOptions);
        
        // Keep the token in the response for development/testing; remove in production.
        res.status(201).json({message: "User registered successfully", user: newUser, token });
    }
    catch (e) {
        console.error("Error registering user:", e);
        res.status(500).json({message: "Internal server error"});
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try{
        const user = await db.query.users.findFirst({
            where: eq(users.email, req.body.email)
        })
        
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        
        const isPasswordValid = await comparePassword(req.body.password, user.password);
        
        if(!isPasswordValid){
            return res.status(401).json({message: "Invalid Credentials"});
        }
        
        const token = await generateToken({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });
        
        const {password, ...userWithoutPassword} = user;     
        res.cookie("token", token, cookieOptions);
        
        // Keep the token in the response for development/testing; remove in production.
        res.status(201).json({message: "Login successful", user: userWithoutPassword, token});
    }
    catch(e) {
        console.error("Error logging in:", e);
        res.status(500).json({message: "Internal server error"});
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });
        
        res.status(200).json({message: "Logout successful"});
    }
    catch (e) {
        console.error("Error logging out:", e);
        res.status(500).json({message: "Internal server error"});
    }
}