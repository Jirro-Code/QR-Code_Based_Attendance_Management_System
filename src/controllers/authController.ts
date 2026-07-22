import {users, type NewUser} from "../db/schema.ts";
import type {Request, Response} from "express";
import {db} from "../db/connections.ts";
import {v4 as uuid} from "uuid";
import { comparePassword, hashPassword } from "../utils/password.ts";
import { generateToken } from "../utils/jwt.ts";
import { eq } from "drizzle-orm";

export const registerUser = async (req: Request<any, any, NewUser>, res: Response) => {
    try{
        const hashedPassword = await hashPassword(req.body.password);
        const newUSer = {
            ...req.body,
            id: uuid(),
            password: hashedPassword
        }
        
        const {password, ...userWithoutPassword} = newUSer;
        await db.insert(users).values(newUSer);
        
        const token = await generateToken({
            id: newUSer.id,
            username: newUSer.username,
            email: newUSer.email,
            role: newUSer.role
        })
        
        res.status(201).json({message: "User registered successfully", user: userWithoutPassword, token });
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
            return res.status(401).json({message: "Invalid Credentials"});
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
        res.status(201).json({message: "Login successful", user: userWithoutPassword, token});
    }
    catch(e) {
        console.error("Error logging in:", e);
        res.status(500).json({message: "Internal server error"});
    }
}