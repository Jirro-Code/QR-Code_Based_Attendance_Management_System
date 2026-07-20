import {users, type NewUser} from "../db/schema.ts";
import type {Request, Response} from "express";
import {db} from "../db/connections.ts";
import {v4 as uuid} from "uuid";
import { hashPassword } from "../utils/password.ts";
import { generateToken } from "../utils/jwt.ts";

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
            userId: newUSer.id,
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