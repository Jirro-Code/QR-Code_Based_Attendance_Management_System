import { verifyToken, type JwtPayload } from "../utils/jwt.ts";
import type { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export const authToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try{
        const authHeader = req.headers.authorization;
        // Check if the authorization header is present and starts with "Bearer ", split the header to extract the token
        const token = authHeader && authHeader.split(" ")[1];
        
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
        res.status(403).json({message: "request is forbidden"});
    }
}