import request from "supertest";
import app from "../src/server.ts";
import { v4 as uuid } from "uuid";
import { createTestUser, clearDatabase } from "./setup/dbHelpers.ts";
import { hashPassword } from "../src/utils/password.ts";


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


describe("Error Handling Authentication Tests", () => {
    afterEach(async () =>{
        await clearDatabase();
    })
    
    describe("POST /api/auth/register", () =>{
        it("should return an error for missing fields", async () => {
            const userData = {
                id: uuid()
            }
            const response = await request(app)
                .post("/api/auth/register")
                .send(userData)
                .expect(400);
            
            console.log("Register Response:", response.body);
            expect(response.body)
        })
        
        it("should return an error for missing fields for user role", async () => {
            const userData = {
                id: uuid(),
                username: `testuser_${Date.now()}_${Math.floor(Math.random() * 100)}`,
                email: `testuser_${Date.now()}_${Math.floor(Math.random() * 100)}@example.com`,
                password: await hashPassword("testUser"),
                role: "user"
            };
            const response = await request(app)
                .post("/api/auth/register")
                .send(userData)
                .expect(400);
            
            console.log("Register Response:", response.body);
            expect(response.body).toHaveProperty("message");
        })
        
        it("should return an error for invalid login credentials fot admin and user", async () => {
            const { testAdmin } = await createTestUser();
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    username: testAdmin.username,
                    email: testAdmin.email,
                    password: "wrongpassword"
                })
                .expect(401);
            console.log("Login Response:", response.body);
            expect(response.body).toHaveProperty("message");
            
            const { testUser } = await createTestUser();
            const response2 = await request(app)
                .post("/api/auth/login")
                .send({
                    username: testUser.username,
                    email: testUser.email,
                    password: "wrongpassword"
                })
                .expect(401);
            console.log("Login Response:", response2.body);
            expect(response2.body).toHaveProperty("message");
        })
        
        it("should return an error for non-existing user", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    username: "nonexistinguser",
                    email: "none@example.com",
                    password: "wrongpassword"
                })
                .expect(404);
            console.log("Login Response:", response.body);
            expect(response.body).toHaveProperty("message");
        })
    })
})