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
        role: "user",
        studentId: `${new Date().getFullYear()}-${Math.floor(Math.random() * 9999)}-ICP`,
        studentLRN: `${Math.floor(Math.random() * 999999999999)}`,
        studentStrand: "ICT",
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
        role: "admin",
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


export const createTestEvent = async (eventData: Partial<NewEvent> = {}, adminId: string) => {
    const testEvent = {
        id: uuid(),
        eventName: `Test Event ${Date.now()}`,
        createdBy: adminId, 
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eventLocation: "Test Location",
        eventDescription: "This is a test event",
        date: new Date(),
        ...eventData
    }
    
    await db.insert(events).values(testEvent);
    return testEvent;
}