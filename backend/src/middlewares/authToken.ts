import { verifyToken, type JwtPayload } from "../utils/jwt.ts";
import type { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export const authToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies?.token;
        
        if(!token){
            return res.status(401).json({message: "No token provided"});
        }
        
        const payload = await verifyToken(token);
        
        //atteches the paylaad to the request json
        req.user = payload;
        console.log("Authenticated user:", req.user);
        next();
    }
    catch(e){
        console.error("Error in authToken middleware:", e);
        res.status(401).json({message: "Invalid or expired token"});
    }
}

export const authAdminToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies?.token;
        
        if(!token){
            return res.status(401).json({message: "No token provided"});
        }
        
        const payload = await verifyToken(token);
        
        if(payload.role !== "admin"){
            return res.status(403).json({message: "Access denied. Admins only."});
        }
        
        req.user = payload;
        console.log("Authenticated user:", req.user);
        next();
    }
    catch(e){
        console.error("Error in authAdminToken middleware:", e);
        res.status(401).json({message: "Invalid or expired token"});
    }
}