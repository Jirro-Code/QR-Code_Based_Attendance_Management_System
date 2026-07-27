import request from "supertest";
import app from "../src/server.ts";
import { v4 as uuid } from "uuid";
import { createTestUser, clearDatabase } from "./setup/dbHelpers.ts";

describe("Authentication Tests", () => {
    afterEach(async () => {
        await clearDatabase();
    });
    
    describe("POST /api/auth/register", () => {
        it("should return 201 and a token for valid credentials", async () => {
            const adminData = {
                id: uuid(),
                username: "adminuser",
                email: "admin@example.com",
                password: "adminpassword",
                role: "admin"
            };
            
            const response = await request(app)
                .post("/api/auth/register")
                .send(adminData)
                .expect(201);
                
            console.log("Register Response:", response.body);
            expect(response.body).toHaveProperty("token");
            expect(response.body).toHaveProperty("user");
            expect(response.body.user).toMatchObject({
                username: adminData.username,
                email: adminData.email,
                role: adminData.role
            });
        });
    });
    
    describe("POST /api/auth/login", () => {
        it("should return 201 and a token for valid credentials", async () => {
            const { testUser, testUserPassword } = await createTestUser();
            
            const loginData = {
                username: testUser.username,
                email: testUser.email,
                password: testUserPassword
            };
            
            const response = await request(app)
                .post("/api/auth/login")
                .send(loginData)
                .expect(201);
            
            console.log("Login Response:", response.body);
            expect(response.body).toHaveProperty("token");
            expect(response.body).toHaveProperty("user");
            expect(response.body.user).toMatchObject({
                username: testUser.username,
                email: testUser.email,
                role: testUser.role,
                studentId: testUser.studentId,
                studentLRN: testUser.studentLRN,
                studentStrand: testUser.studentStrand,
                studentSection: testUser.studentSection
            });
        })
    })
});
