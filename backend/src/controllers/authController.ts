import { users, passwordResetOTP} from "../db/schema.ts";
import { db } from "../db/connections.ts";
import { comparePassword, hashPassword } from "../utils/password.ts";
import { sendPasswordResetOTP } from "../services/email.ts";
import { generatePasswordResetOTP, hashPasswordResetOTP, verifyPasswordResetOTP} from "../utils/otp.ts";
import { generateToken } from "../utils/jwt.ts";
import { uploadProfilePicture } from "../services/azureBlob.ts";
import { type Request, type Response} from "express";
import { type AuthenticatedRequest } from "../middlewares/authToken.ts";
import { and, eq } from "drizzle-orm";
import { env } from "../../env.ts";
import { z } from "zod";
import ms from "ms";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ms(env.JWT_EXPIRES_IN as ms.StringValue)
};

const OTP_EXPIRATION_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const OTP_LOCK_DURATION_MS = 10 * 60 * 1000;
const OTP_MAX_FAILED_ATTEMPTS = 3;

export const registerUser = async (req: Request, res: Response) => {
    try{
        
        const profilePicture = req.file; 
        
        if(req.body.role === "user" && (req.body.studentId === undefined || req.body.studentLRN === undefined || req.body.studentStrand === undefined || req.body.studentSection === undefined)){
            console.error("Missing required fields for user role:", req.body);
            return res.status(400).json({message: "Missing required fields for user role"});
        }
        
        const [emailConflict, studentIdConflict, studentLRNConflict] = await Promise.all([
            db.query.users.findFirst({
                where: eq(users.email, req.body.email),
            }),
            req.body.role === "user"
                ? db.query.users.findFirst({
                    where: eq(users.studentId, req.body.studentId!),
                })
                : null,
            req.body.role === "user"
                ? db.query.users.findFirst({
                    where: eq(users.studentLRN, req.body.studentLRN!),
                })
                : null,
        ]);
        
        const duplicateFields: string[] = [];
        if (emailConflict) duplicateFields.push("email");
        if (studentIdConflict) duplicateFields.push("studentId");
        if (studentLRNConflict) duplicateFields.push("studentLRN");
        
        if (duplicateFields.length > 0) {
            console.error("Duplicate data found for:", duplicateFields);
            return res.status(409).json({
                message: `Duplicate data found for: ${duplicateFields.join(", ")}`,
                duplicateFields,
            });
        }
        
        let profilePictureUrl: string | null = null;
        
        if (profilePicture) {
            profilePictureUrl = await uploadProfilePicture(profilePicture);
        }
        
        const hashedPassword = await hashPassword(req.body.password);
        
        const [newUser] = await db
        .insert(users)
        .values({
            ...req.body,
            password: hashedPassword,
            profilePictureUrl: profilePictureUrl
        }).returning({
            profilePictureUrl: users.profilePictureUrl,
            id: users.id,
            username: users.username,
            email: users.email,
            role: users.role
        });
        
        res.status(201).json({message: "User registered successfully", user: newUser});
    }
    catch (e) {
        console.error("Error registering user:", e);
        res.status(500).json({message: "Internal server error"});
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try{
        
        const user = await db.query.users.findFirst({
            where: req.body.role === "user" ? 
            and(eq(users.studentId, req.body.studentId), eq(users.role, req.body.role)) : and(eq(users.email, req.body.email), eq(users.role, req.body.role))
        })
        
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        
        const isPasswordValid = await comparePassword(req.body.password, user.password);
        
        if(!isPasswordValid){
            return res.status(401).json({message: "Invalid Credentials"});
        }
        
        if(user.isArchived){
            return res.status(403).json({message: "This account is archived. Please contact the administrator."});
        }
        
        const token = await generateToken({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            isActive: user.isArchived
        });
        
        const {password, ...userWithoutPassword} = user;     
        res.cookie("token", token, cookieOptions);
        console.log(token);
        res.status(201).json({message: "Login successful", user: userWithoutPassword});
    }
    catch(e) {
        console.error("Error logging in:", e);
        res.status(500).json({message: "Internal server error"});
    }
}

export const logoutUser = async (_req: AuthenticatedRequest, res: Response) => {
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

export const forgotPassword = async (req: Request, res: Response) => {
    try{
        const email = z.string().email().parse(req.body.email);
        const role = z.enum(["user", "admin"]).parse(req.body.role);
        const user = await db.query.users.findFirst({
            where: and(eq(users.email, email), eq(users.role, role))
        });
        
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        
        if(user.isArchived){
            return res.status(403).json({message: "This account is archived. Please contact the administrator."});
        }
        
        const existingOtp = await db.query.passwordResetOTP.findFirst({
            where: eq(passwordResetOTP.userEmail, user.email)
        });
        const now = new Date();
        
        if (existingOtp?.lockedUntil && existingOtp.lockedUntil > now) {
            return res.status(423).json({
                message: "OTP verification is temporarily locked",
                lockedUntil: existingOtp.lockedUntil.toISOString()
            });
        }
        
        if (existingOtp?.resendAvailableAt && existingOtp.resendAvailableAt > now) {
            return res.status(429).json({
                message: "Please wait before requesting another OTP",
                resendAvailableAt: existingOtp.resendAvailableAt.toISOString()
            });
        }
        
        const token = generatePasswordResetOTP();
        const hashedToken = hashPasswordResetOTP(token);
        
        try {
            const result = await sendPasswordResetOTP(user.email, token);
            
            if(result.rejected.includes(user.email)){
                return res.status(500).json({message: "Failed to send OTP"});
            }
        }
        catch (e) {
            console.error("Error sending password reset OTP:", e);
            return res.status(500).json({message: "Failed to send OTP"});
        }
        
        const expiresAt = new Date(now.getTime() + OTP_EXPIRATION_MS);
        const resendAvailableAt = new Date(now.getTime() + OTP_RESEND_COOLDOWN_MS);
        
        if (existingOtp) {
            await db.update(passwordResetOTP)
                .set({
                    tokenHash: hashedToken,
                    expiresAt,
                    resendAvailableAt,
                    failedAttempts: 0,
                    lockedUntil: null,
                    createdAt: now
                })
                .where(eq(passwordResetOTP.id, existingOtp.id));
        } else {
            await db.insert(passwordResetOTP).values({
                userEmail: user.email,
                tokenHash: hashedToken,
                expiresAt,
                resendAvailableAt,
                failedAttempts: 0,
                lockedUntil: null
            });
        }
        
        res.status(200).json({
            message: "Password reset OTP sent to email",
            resendAvailableAt: resendAvailableAt.toISOString()
        });
    }
    catch (e) {
        if (e instanceof z.ZodError) {
            console.error("Validation error in forgot password:", e.issues);
            return res.status(400).json({message: "Invalid request data", errors: e.issues});
        }
        console.error("Error in forgot password:", e);
        res.status(500).json({message: "Internal server error"});
    }
}

export const verifyOtp = async (req: Request, res: Response) => {
    try{
        const email = z.string().email().parse(req.body.email);
        const role = z.enum(["user", "admin"]).parse(req.body.role);
        const otp = z.string().length(6).parse(req.body.otp);
        
        const user = await db.query.users.findFirst({
            where: and(eq(users.email, email), eq(users.role, role))
        });
        
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        
        const otpRecord = await db.query.passwordResetOTP.findFirst({
            where: eq(passwordResetOTP.userEmail, email)
        });
        
        if(!otpRecord){
            return res.status(404).json({message: "OTP expired. Please request a new one"});
        }
        
        const now = new Date();
        
        if (otpRecord.lockedUntil && otpRecord.lockedUntil > now) {
            return res.status(423).json({
                message: "OTP verification is temporarily locked",
                lockedUntil: otpRecord.lockedUntil.toISOString()
            });
        }
        
        if (otpRecord.lockedUntil && otpRecord.lockedUntil <= now) {
            await db.update(passwordResetOTP)
                .set({ failedAttempts: 0, lockedUntil: null })
                .where(eq(passwordResetOTP.id, otpRecord.id));
            otpRecord.failedAttempts = 0;
            otpRecord.lockedUntil = null;
        }
        
        if (otpRecord.expiresAt <= now) {
            await db.delete(passwordResetOTP).where(eq(passwordResetOTP.id, otpRecord.id));
            return res.status(410).json({message: "OTP expired. Please request a new one"});
        }
        
        const isOtpValid = await verifyPasswordResetOTP(otp, otpRecord.tokenHash);
        
        if(!isOtpValid){
            const failedAttempts = otpRecord.failedAttempts + 1;
            const lockedUntil = failedAttempts >= OTP_MAX_FAILED_ATTEMPTS
                ? new Date(now.getTime() + OTP_LOCK_DURATION_MS)
                : null;
            
            await db.update(passwordResetOTP)
                .set({ failedAttempts, lockedUntil })
                .where(eq(passwordResetOTP.id, otpRecord.id));
            
            if (lockedUntil) {
                return res.status(423).json({
                    message: "OTP verification is temporarily locked",
                    lockedUntil: lockedUntil.toISOString()
                });
            }
            
            return res.status(401).json({
                message: "Invalid OTP",
                attemptsRemaining: OTP_MAX_FAILED_ATTEMPTS - failedAttempts
            });
        }
        
        await db.delete(passwordResetOTP).where(eq(passwordResetOTP.userEmail, email)).execute();
        
        res.status(200).json({message: "OTP confirmed. You can now reset your password."});
    } 
    catch (e) {
        if (e instanceof z.ZodError) {
            console.error("Validation error in confirm OTP:", e.issues);
            return res.status(400).json({message: "Invalid request data", errors: e.issues});
        }
        console.error("Error in confirm OTP:", e);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getOtpStatus = async (req: Request, res: Response) => {
    try {
        const email = z.string().email().parse(req.query.email);
        const role = z.enum(["user", "admin"]).parse(req.query.role);
        const user = await db.query.users.findFirst({
            where: and(eq(users.email, email), eq(users.role, role))
        });
        
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        
        const otpRecord = await db.query.passwordResetOTP.findFirst({
            where: eq(passwordResetOTP.userEmail, email)
        });
        
        if (!otpRecord) {
            return res.status(404).json({message: "OTP not found"});
        }
        
        const now = new Date();
        if (otpRecord.expiresAt <= now) {
            await db.delete(passwordResetOTP).where(eq(passwordResetOTP.id, otpRecord.id));
            return res.status(410).json({message: "OTP expired. Please request a new one"});
        }
        
        res.status(200).json({
            expiresAt: otpRecord.expiresAt.toISOString(),
            resendAvailableAt: otpRecord.resendAvailableAt?.toISOString() ?? null,
            lockedUntil: otpRecord.lockedUntil && otpRecord.lockedUntil > now
                ? otpRecord.lockedUntil.toISOString()
                : null
        });
    }
    catch (e) {
        if (e instanceof z.ZodError) {
            return res.status(400).json({message: "Invalid request data", errors: e.issues});
        }
        console.error("Error fetching OTP status:", e);
        res.status(500).json({message: "Internal server error"});
    }
}
