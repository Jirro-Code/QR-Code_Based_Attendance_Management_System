import { randomBytes } from "node:crypto";
import type { Request, Response } from "express";
import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "../db/connections.ts";
import { deviceRegistrations, deviceRestrictions, securityAttempts } from "../db/schema.ts";

const DEVICE_COOKIE = "device_id";
const DEVICE_MAX_AGE = 365 * 24 * 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === "production";
const restrictionMinutes = [10, 60, 12 * 60, 24 * 60, 3 * 24 * 60] as const;
const failureThreshold = 3;

const deviceCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" as const : "lax" as const,
    path: "/",
    maxAge: DEVICE_MAX_AGE,
};

const getClientIp = (req: Request) => req.ip ?? req.socket.remoteAddress ?? null;

const getDeviceId = (req: Request, res: Response) => {
    const cookieDeviceId = req.cookies?.[DEVICE_COOKIE];
    const deviceId = typeof cookieDeviceId === "string" && /^[a-f0-9]{64}$/.test(cookieDeviceId)
        ? cookieDeviceId
        : randomBytes(32).toString("hex");
    
    if (deviceId !== cookieDeviceId) {
        res.cookie(DEVICE_COOKIE, deviceId, deviceCookieOptions);
    }
    return deviceId;
};

const ensureRegistration = async (deviceId: string, req: Request) => {
    const now = new Date();
    await db.insert(deviceRegistrations).values({
        deviceId,
        lastSeenAt: now,
        lastIpAddress: getClientIp(req),
        userAgent: req.get("user-agent")?.slice(0, 500),
    }).onConflictDoUpdate({
        target: deviceRegistrations.deviceId,
        set: {
            lastSeenAt: now,
            lastIpAddress: getClientIp(req),
            userAgent: req.get("user-agent")?.slice(0, 500),
        },
    });
};

export const prepareDeviceRequest = async (req: Request, res: Response) => {
    const deviceId = getDeviceId(req, res);
    await ensureRegistration(deviceId, req);
    return deviceId;
};

export const getDeviceRestriction = async (accountId: string, deviceId: string) => {
    const restriction = await db.query.deviceRestrictions.findFirst({
        where: and(
            eq(deviceRestrictions.accountId, accountId),
            eq(deviceRestrictions.deviceId, deviceId),
            gt(deviceRestrictions.restrictedUntil, new Date())
        ),
    });
    return restriction ?? null;
};

export const recordSecurityAttempt = async (params: {
    accountId?: string;
    deviceId: string;
    ipAddress: string | null;
    action: "login" | "change_password";
    result: "success" | "failure" | "blocked";
}) => {
    await db.insert(securityAttempts).values(params);
};

export const recordDeviceFailure = async (params: {
    accountId: string;
    deviceId: string;
    ipAddress: string | null;
    action: "login" | "change_password";
}) => {
    const now = new Date();
    return db.transaction(async (tx) => {
        await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${`${params.accountId}:${params.deviceId}`}))`);
        const result = await tx.execute<{
            failed_attempts: number;
            escalation_level: number;
            restricted_until: Date | null;
        }>(sql`SELECT failed_attempts, escalation_level, restricted_until
            FROM device_restrictions
            WHERE account_id = ${params.accountId} AND device_id = ${params.deviceId}
            FOR UPDATE`);
        const existing = result.rows[0];
        const failedAttempts = (existing?.failed_attempts ?? 0) + 1;
        const shouldRestrict = failedAttempts % failureThreshold === 0;
        const escalationLevel = existing?.escalation_level ?? 0;
        const duration = restrictionMinutes[Math.min(escalationLevel, restrictionMinutes.length - 1)] ?? 3 * 24 * 60;
        const restrictedUntil = shouldRestrict
            ? new Date(now.getTime() + duration * 60 * 1000)
            : existing?.restricted_until ?? null;
        
        await tx.insert(securityAttempts).values({
            accountId: params.accountId,
            deviceId: params.deviceId,
            ipAddress: params.ipAddress,
            action: params.action,
            result: shouldRestrict ? "blocked" : "failure",
            createdAt: now,
        });
        await tx.insert(deviceRestrictions).values({
            accountId: params.accountId,
            deviceId: params.deviceId,
            reason: params.action,
            failedAttempts,
            escalationLevel: shouldRestrict ? escalationLevel + 1 : escalationLevel,
            restrictedUntil,
            updatedAt: now,
        }).onConflictDoUpdate({
            target: [deviceRestrictions.accountId, deviceRestrictions.deviceId],
            set: {
                failedAttempts,
                escalationLevel: shouldRestrict ? escalationLevel + 1 : escalationLevel,
                restrictedUntil,
                updatedAt: now,
            },
        });
        return restrictedUntil;
    });
};

export const recordDeviceSuccess = async (params: {
    accountId?: string;
    deviceId: string;
    ipAddress: string | null;
    action: "login" | "change_password";
}) => {
    if (params.accountId) {
        await db.update(deviceRestrictions)
            .set({
                failedAttempts: 0,
                restrictedUntil: null,
                updatedAt: new Date(),
            })
            .where(and(
                eq(deviceRestrictions.accountId, params.accountId),
                eq(deviceRestrictions.deviceId, params.deviceId),
            ));
    }
    await recordSecurityAttempt({ ...params, result: "success" });
};

export const getDeviceCookieName = () => DEVICE_COOKIE;
