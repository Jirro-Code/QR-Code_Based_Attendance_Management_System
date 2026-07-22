import { type JWTPayload, jwtVerify, SignJWT } from "jose";
import { createSecretKey } from "crypto";
import {env} from "../../env.ts";

export interface JwtPayload extends JWTPayload {
    id: string;
    username: string;
    email: string;
    role: string;
}

export const generateToken = async (payload: JwtPayload) => {
    const secretKey = createSecretKey(env.JWT_SECRET, "utf-8");

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime(env.JWT_EXPIRES_IN || "5h")
        .sign(secretKey);
}

export const verifyToken = async (token: string): Promise<JwtPayload> => {
    const secretKey = createSecretKey(Buffer.from(env.JWT_SECRET, "utf-8"));
    const { payload } = await jwtVerify(token, secretKey);
    return payload as JwtPayload;
}