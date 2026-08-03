import db from "../../src/db/connections.ts";
import { users, attendance, events, type NewUser, type NewEvent, type NewAttendance } from "../../src/db/schema.ts";
import { generateToken } from "../../src/utils/jwt.ts";
import { hashPassword } from "../../src/utils/password.ts";


export const createTestUser = async (userData: Partial<NewUser> = {}): Promise<{ testUser: any; userToken: string; testAdmin: any; adminToken: string; testUserPassword: string; testAdminPassword: string }> => {
    const testUser = {
        username: `testuser_${Date.now()}_${Math.floor(Math.random() * 100)}`,
        email: `testuser_${Date.now()}_${Math.floor(Math.random() * 100)}@example.com`,
        password: await hashPassword("testUser"),
        role: "user" as const,
        studentId: `${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}-ICP`,
        studentLRN: `${String(Math.floor(Math.random() * 1000000000000)).padStart(12, "0")}`,
        studentStrand: "ICT" as const,
        studentSection: "ICT-12-5",
        ...userData
    }
    const [createdUser] = await db.insert(users).values([testUser as any]).returning();
    if (!createdUser) throw new Error("Failed to create test user");

    const userToken = await generateToken({
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        role: createdUser.role
    })
    
    const testAdmin = {
        username: `testadmin_${Date.now()}_${Math.floor(Math.random() * 100)}`,
        email: `testadmin_${Date.now()}_${Math.floor(Math.random() * 100)}@example.com`,
        password: await hashPassword("testAdmin"),
        role: "admin" as const,
        // admin still needs a valid studentStrand per schema
        studentStrand: "ICT" as const,
        studentSection: "ICT-Admin",
        ...userData
    } as Partial<NewUser>;

    const [createdAdmin] = await db.insert(users).values([testAdmin as any]).returning();
    if (!createdAdmin) throw new Error("Failed to create test admin");

    const adminToken = await generateToken({
        id: createdAdmin.id,
        username: createdAdmin.username,
        email: createdAdmin.email,
        role: createdAdmin.role
    })

    return { testUser: createdUser, userToken, testAdmin: createdAdmin, adminToken, testUserPassword: "testUser", testAdminPassword: "testAdmin" };
}

export const createMultipleUser = async (userData: Partial<NewUser>, userCount: number, adminCount: number): Promise<{ testUsers: any[]; testUsersToken: string[]; testAdmins: any[]; testAdminsToken: string[] }> => {
    const testUsers = [] as any[];
    const testUsersToken: string[] = []
    for(let i = 0; i < userCount; i++){
        const seed: Partial<NewUser> = {
            username: `testuser_${Date.now()}_${Math.floor(Math.random() * 100)}`,
            email: `testuser_${Date.now()}_${Math.floor(Math.random() * 100)}@example.com`,
            password: await hashPassword(`testUser ${i}`),
            role: "user" as const,
            studentId: `${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}-ICP`,
            studentLRN: `${String(Math.floor(Math.random() * 1000000000000)).padStart(12, "0")}`,
            studentStrand: "ICT" as const,
            studentSection: "ICT-12-5",
            ...userData
        }

            const [createdUser] = await db.insert(users).values([seed as any]).returning();
            if (!createdUser) throw new Error("Failed to create test user");
            testUsers.push(createdUser);
        
        const userToken = await generateToken({
            id: createdUser.id,
            username: createdUser.username,
            email: createdUser.email,
            role: createdUser.role
        })
        testUsersToken.push(userToken);
    }
    
    const testAdmins = [] as any[];
    const testAdminsToken: string[] = []
    for(let i = 0; i < adminCount; i++){
        const seed: Partial<NewUser> = {
            username: `testadmin_${Date.now()}_${Math.floor(Math.random() * 100)}`,
            email: `testadmin_${Date.now()}_${Math.floor(Math.random() * 100)}@example.com`,
            password: await hashPassword(`testAdmin ${i}`),
            role: "admin" as const,
            studentStrand: "ICT" as const,
            studentSection: "ICT-Admin",
            ...userData
        }

        const [createdAdmin] = await db.insert(users).values([seed as any]).returning();
        if (!createdAdmin) throw new Error("Failed to create test admin");
        testAdmins.push(createdAdmin);
        
        const adminToken = await generateToken({
            id: createdAdmin.id,
            username: createdAdmin.username,
            email: createdAdmin.email,
            role: createdAdmin.role
        });
        testAdminsToken.push(adminToken);
    }
    
    return { testUsers, testUsersToken, testAdmins, testAdminsToken };
}

export const createTestEvent = async (eventData: Partial<NewEvent>, adminId: string ) => {
    const rawDate = eventData.eventDate ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const eventDateStr = rawDate instanceof Date ? rawDate.toISOString().split("T")[0] : String(rawDate);

    const seed: any = {
        ...eventData,
        createdBy: adminId,
        eventName: `Test Event ${Date.now()}`,
        eventDate: eventDateStr,
        eventDescription: "This is a test event",
        eventLocation: "Test Location",
    }

    const [createdEvent] = await db.insert(events).values([seed as any]).returning();
    if (!createdEvent) throw new Error("Failed to create test event");

    return {testEvent: createdEvent};
}


export const createTestAttendance = async (attendanceData: Partial<NewAttendance>, userId: string, eventId: string) => {
    const seed = {
        userId: userId,
        eventId: eventId,
        attendedAt: new Date(),
        isLate: false,
        ...attendanceData
    }

    const [createdAttendance] = await db.insert(attendance).values([seed]).returning();
    if (!createdAttendance) throw new Error("Failed to create attendance");

    return {testAttendance: createdAttendance};
}

export const clearDatabase = async () => {
    await db.delete(attendance).execute();
    await db.delete(events).execute();
    await db.delete(users).execute();
}