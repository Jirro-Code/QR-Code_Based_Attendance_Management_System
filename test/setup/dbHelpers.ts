import db from "../../src/db/connections.ts";
import { users, attendance, events, type NewUser, type NewEvent, type NewAttendance } from "../../src/db/schema.ts";
import { generateToken } from "../../src/utils/jwt.ts";
import { hashPassword } from "../../src/utils/password.ts";
import {v4 as uuid} from "uuid";

export const createTestUser = async (userData: Partial<NewUser> = {}) => {
    const testUser = {
        id: uuid(),
        username: `testuser_${Date.now()}_${Math.floor(Math.random() * 100)}`,
        email: `testuser_${Date.now()}_${Math.floor(Math.random() * 100)}@example.com`,
        password: await hashPassword("testUser"),
        role: "user" as const,
        studentId: `${new Date().getFullYear()}-${Math.floor(Math.random() * 9999)}-ICP`,
        studentLRN: `${Math.floor(Math.random() * 999999999999)}`,
        studentStrand: "ICT" as const,
        studentSection: "ICT-12-5",
        ...userData
    }
    
    const userToken = await generateToken({
        id: testUser.id,
        username: testUser.username,
        email: testUser.email,
        role: testUser.role
    })
    
    const testAdmin = {
        id: uuid(),
        username: `testadmin_${Date.now()}_${Math.floor(Math.random() * 100)}`,
        email: `testadmin_${Date.now()}_${Math.floor(Math.random() * 100)}@example.com`,
        password: await hashPassword("testAdmin"),
        role: "admin" as const,
        ...userData
    }
    
    const adminToken = await generateToken({
        id: testAdmin.id,
        username: testAdmin.username,
        email: testAdmin.email,
        role: testAdmin.role
    })
    
    await db.insert(users).values(testUser);
    await db.insert(users).values(testAdmin);
    
    return { testUser, userToken, testAdmin, adminToken, testUserPassword: "testUser", testAdminPassword: "testAdmin" };
}

export const createMultipleUser = async (userData: Partial<NewUser>, userCount: number, adminCount: number) => {
    const testUsers = [];
    const testUsersToken = []
    for(let i = 0; i < userCount; i++){
        const testUser = {
            id: uuid(),
            username: `testuser_${Date.now()}_${Math.floor(Math.random() * 100)}`,
            email: `testuser_${Date.now()}_${Math.floor(Math.random() * 100)}@example.com`,
            password: await hashPassword(`testUser ${i}`),
            role: "user" as const,
            studentId: `${new Date().getFullYear()}-${Math.floor(Math.random() * 9999)}-ICP`,
            studentLRN: `${Math.floor(Math.random() * 999999999999)}`,
            studentStrand: "ICT" as const,
            studentSection: "ICT-12-5",
            ...userData
        }
        testUsers.push(testUser);
        await db.insert(users).values(testUser);
        
        const userToken = await generateToken({
            id: testUser.id,
            username: testUser.username,
            email: testUser.email,
            role: testUser.role
        })
        testUsersToken.push(userToken);
    }
    
    const testAdmins = [];
    const testAdminsToken = []
    for(let i = 0; i < adminCount; i++){
        const testAdmin = {
            id: uuid(),
            username: `testadmin_${Date.now()}_${Math.floor(Math.random() * 100)}`,
            email: `testadmin_${Date.now()}_${Math.floor(Math.random() * 100)}@example.com`,
            password: await hashPassword(`testAdmin ${i}`),
            role: "admin" as const,
            ...userData
        }
        testAdmins.push(testAdmin);
        await db.insert(users).values(testAdmin);
        
        const adminToken = await generateToken({
            id: testAdmin.id,
            username: testAdmin.username,
            email: testAdmin.email,
            role: testAdmin.role
        });
        testAdminsToken.push(adminToken);
    }
    
    return { testUsers, testUsersToken, testAdmins, testAdminsToken };
}

export const createTestEvent = async (eventData: Partial<NewEvent>, adminId: string ) => {
    const testEvent = {
        id: uuid(),
        createdBy: adminId, 
        eventName: `Test Event ${Date.now()}`,
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
        eventDescription: "This is a test event",
        eventLocation: "Test Location"
    }
    
    await db.insert(events).values(testEvent);
    
    return {testEvent};
}


export const createTestAttendance = async (attendanceData: Partial<NewAttendance>, userId: string, eventId: string) => {
    const testAttendance = {
        id: uuid(),
        userId: userId,
        eventId: eventId,
        attendedAt: new Date(),
        isLate: false
    }
    
    await db.insert(attendance).values(testAttendance);
    
    return {testAttendance};
}

export const clearDatabase = async () => {
    await db.delete(attendance).execute();
    await db.delete(events).execute();
    await db.delete(users).execute();
}