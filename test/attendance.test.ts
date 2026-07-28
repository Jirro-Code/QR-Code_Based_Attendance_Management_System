import request from "supertest";
import app from "../src/server.ts";
import { v4 as uuid } from "uuid";
import { clearDatabase, createTestUser, createMultipleUser ,createTestEvent, createTestAttendance } from "./setup/dbHelpers.ts";

describe("attendance controller tests", () => {
    afterEach(async () => {
        await clearDatabase();
    });
    
    describe("user attendance route", () => {
        it("should return 200 and the current user's attendance for a valid token", async () => {
            const { testUser, userToken, testAdmin } = await createTestUser();
            const { testEvent } = await createTestEvent({}, testAdmin.id);
            await createTestAttendance({}, testUser.id, testEvent.id);
            
            const response = await request(app)
                .get("/api/attendance/myAttendance")
                .set("Authorization", `Bearer ${userToken}`)
                .expect(200);
            
            console.log("GET my attendance Response:", response.body);
            expect(response.body).toHaveProperty("message", "Attendance fetched successfully");
        })
    })
    
    describe("admin attendance routes", () => {
        it("should return 200 and attendance records for admin", async () => {
            const { testAdminsToken, testAdmins, testUsers } = await createMultipleUser({}, 5, 1);
            const { testEvent } = await createTestEvent({}, testAdmins[0]!.id);
            
            for (const user of testUsers) {
                await createTestAttendance({}, user.id, testEvent.id);
            }
            
            const response = await request(app)
                .get("/api/attendance/all")
                .set("Authorization", `Bearer ${testAdminsToken[0]}`)
                .expect(200);
            
            console.log("GET all attendance Response:", response.body);
            expect(response.body).toHaveProperty("message", "Attendance fetched successfully");
            expect(response.body.attendance).toHaveLength(testUsers.length);
        })
        
        it("should return 201 when marking attendance for a valid student and event", async () => {
            const { testUser, adminToken, testAdmin } = await createTestUser();
            const { testEvent } = await createTestEvent({}, testAdmin.id);
            
            const response = await request(app)
                .post("/api/attendance/mark")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    userId: testUser.id,
                    eventId: testEvent.id
                })
                .expect(201);
            
            console.log("POST mark attendance Response:", response.body);
            expect(response.body).toHaveProperty("message", "Attendance marked successfully");
        })
        
        it("should return 200 when updating attendance", async () => {
            const { testUser, adminToken, testAdmin } = await createTestUser();
            const { testEvent } = await createTestEvent({}, testAdmin.id);
            await createTestAttendance({}, testUser.id, testEvent.id);
            
            const response = await request(app)
                .put(`/api/attendance/update/${testUser.id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ isLate: true })
                .expect(200);
            
            console.log("PUT update attendance Response:", response.body);
            expect(response.body).toHaveProperty("message", "Attendance updated successfully");
        })
        
        it("should return 200 when deleting attendance", async () => {
            const { testUser, adminToken, testAdmin } = await createTestUser();
            const { testEvent } = await createTestEvent({}, testAdmin.id);
            await createTestAttendance({}, testUser.id, testEvent.id);
            
            const response = await request(app)
                .delete(`/api/attendance/delete/${testUser.id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(200);
            
            console.log("DELETE attendance Response:", response.body);
            expect(response.body).toHaveProperty("message", "User attendance deleted successfully");
        })
    })
    
    describe("Error handling tests for attendance controller", () => {
        it("should return 401 when no token is provided", async () => {
            const response = await request(app)
                .get("/api/attendance/myAttendance")
                .expect(401);
            
            console.log("GET my attendance Response:", response.body);
            expect(response.body).toHaveProperty("message", "No token provided");
        })
        
        it("should return 403 for a malformed token", async () => {
            const response = await request(app)
                .get("/api/attendance/myAttendance")
                .set("Authorization", "Bearer invalid.token.value")
                .expect(403);
            
            console.log("GET my attendance Response:", response.body);
            expect(response.body).toHaveProperty("message", "request is forbidden");
        })
        
        it("should return 403 for a valid student token on admin-only routes", async () => {
            const { userToken } = await createTestUser();
            
            const response = await request(app)
                .get("/api/attendance/all")
                .set("Authorization", `Bearer ${userToken}`)
                .expect(403);
            
            console.log("GET all attendance Response:", response.body);
            expect(response.body).toHaveProperty("message", "Access denied. Admins only.");
        })
        
        it("should return 400 when attendance is marked twice for the same user and event", async () => {
            const { testUser, adminToken, testAdmin } = await createTestUser();
            const { testEvent } = await createTestEvent({}, testAdmin.id);
            await createTestAttendance({}, testUser.id, testEvent.id);
            
            const response = await request(app)
                .post("/api/attendance/mark")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    userId: testUser.id,
                    eventId: testEvent.id,
                    isLate: false
                })
                .expect(400);
            
            console.log("POST duplicate attendance Response:", response.body);
            expect(response.body).toHaveProperty("message", "Attendance already marked for this user and event");
        })
        
        it("should return 400 for missing required fields", async () => {
            const { adminToken } = await createTestUser();
            
            const response = await request(app)
                .post("/api/attendance/mark")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ userId: uuid() })
                .expect(400);
            
            console.log("POST mark attendance Response:", response.body);
            expect(response.body).toHaveProperty("error", "Validation failed");
        })
        
        it("should return 404 when the user does not exist", async () => {
            const { adminToken, testAdmin } = await createTestUser();
            const { testEvent } = await createTestEvent({}, testAdmin.id);
            
            const response = await request(app)
                .post("/api/attendance/mark")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    userId: uuid(),
                    eventId: testEvent.id,
                    isLate: false
                })
                .expect(404);
            
            console.log("POST mark attendance Response:", response.body);
            expect(response.body).toHaveProperty("message", "Student not found");
        })
        
        it("should return 400 for an invalid user ID parameter", async () => {
            const { adminToken } = await createTestUser();
            
            const response = await request(app)
                .get("/api/attendance/userId/not-a-uuid")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(400);
            
            console.log("GET attendance by user Response:", response.body);
            expect(response.body).toHaveProperty("error", "Invalid parameters");
        })
        
        it("should return 400 for an invalid event ID parameter", async () => {
            const { adminToken } = await createTestUser();
            
            const response = await request(app)
                .get("/api/attendance/eventId/not-a-uuid")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(400);
                
            console.log("GET attendance by event Response:", response.body);
            expect(response.body).toHaveProperty("error", "Invalid parameters");
        })
        
        it("should return 400 for an invalid attendance update body", async () => {
            const { testUser, adminToken, testAdmin } = await createTestUser();
            const { testEvent } = await createTestEvent({}, testAdmin.id);
            await createTestAttendance({}, testUser.id, testEvent.id);
            
            const response = await request(app)
                .put(`/api/attendance/update/${testUser.id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({})
                .expect(400);
            
            console.log("PUT update attendance Response:", response.body);
            expect(response.body).toHaveProperty("error", "Validation failed");
        })
        
        it("should return 404 for a non-existing attendance record", async () => {
            const { adminToken } = await createTestUser();
            
            const response = await request(app)
                .put(`/api/attendance/update/${uuid()}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ isLate: true })
                .expect(404);
            
            console.log("PUT update attendance Response:", response.body);
            expect(response.body).toHaveProperty("message", "Attendance not found for this user");
        })
        
        it("should return 400 for an invalid user ID when deleting attendance", async () => {
            const { adminToken } = await createTestUser();
            
            const response = await request(app)
                .delete("/api/attendance/delete/not-a-uuid")
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(400);
            
            console.log("DELETE attendance Response:", response.body);
            expect(response.body).toHaveProperty("error", "Invalid parameters");
        })
        
        it("should return 404 for a non-existing attendance record when deleting", async () => {
            const { adminToken } = await createTestUser();
            
            const response = await request(app)
                .delete(`/api/attendance/delete/${uuid()}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .expect(404);
            
            console.log("DELETE attendance Response:", response.body);
            expect(response.body).toHaveProperty("message", "User not found");
        })
    })
})