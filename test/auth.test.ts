import request from "supertest";
import app from "../src/server.ts";
import { createTestUser, clearDatabase } from "./setup/dbHelpers.ts";


describe("Authentication Tests", () => {
    afterEach(async () => {
        await clearDatabase();
    });
    
    describe("POST /api/auth/register", () => {
        it("should return 201 and a token for valid credentials", async () => {
            const adminData = {
                username: "adminuser",
                email: "admin@example.com",
                password: "adminpassword",
                role: "admin",
                studentStrand: "ICT",
                studentSection: "ICT-Admin"
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
    
    describe("Error handling tests for auth controller", () =>{
        it("should return an error for missing fields", async () => {
            
            const response = await request(app)
                .post("/api/auth/register")
                .send({})
                .expect(400);
            
            console.log("Register Response:", response.body);
            expect(response.body.details[0].message).toBe("Invalid input: expected string, received undefined");
        })
        
        it("should return an error for missing fields for user role", async () => {
            const userData = {
                username: `testuser`,
                email: `testuser@example.com`,
                password: "testUser",
                role: "user" as const
            };
            const response = await request(app)
                .post("/api/auth/register")
                .send(userData)
                .expect(400);
            
            console.log("Register Response:", response.body);
            expect(response.body).toHaveProperty("message", "Missing required fields for user role");
        })
        
        it("should return an error for invalid login credentials fot admin and user", async () => {
            const { testUser, testAdmin } = await createTestUser();
            
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    username: testAdmin.username,
                    email: testAdmin.email,
                    password: "wrongpassword"
                })
                .expect(401);
            
            console.log("Login Response:", response.body);
            expect(response.body).toHaveProperty("message", "Invalid Credentials");
            
            const response2 = await request(app)
                .post("/api/auth/login")
                .send({
                    username: testUser.username,
                    email: testUser.email,
                    password: "wrongpassword"
                })
                .expect(401);
            
            console.log("Login Response:", response2.body);
            expect(response2.body).toHaveProperty("message", "Invalid Credentials");
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
            expect(response.body).toHaveProperty("message", "User not found");
        })

        it("should return an error for invalid email format", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    username: "testuser",
                    email: "invalid-email",
                    password: "wrongpassword"
                })
                .expect(400);
            
            console.log("Login Response:", response.body);
            expect(response.body.details[0].message).toBe("Invalid email address");
        })
        
        it("should return an error for invalid password format", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    username: "testuser",
                    email: "testuser@example.com",
                    password: "a"
                })
                .expect(400);
            
            console.log("Login Response:", response.body);
            expect(response.body.details[0].message).toBe("Password must be at least 6 characters long");
        })

        it("should return an error for invalid username format", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    username: "a",
                    email: "testuser@example.com",
                    password: "wrongpassword"
                })
                .expect(400);
            
            console.log("Login Response:", response.body);
            expect(response.body.details[0].message).toBe("Username must be at least 3 characters long");
        })

        it("should return an error for missing username", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "testuser@example.com",
                    password: "wrongpassword"
                })
                .expect(400);
            
            console.log("Login Response:", response.body);
            expect(response.body.details[0].message).toBe("Invalid input: expected string, received undefined");
        })

        it("should return an error for missing email", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    username: "testuser",
                    password: "wrongpassword"
                })
                .expect(400);
            
            console.log("Login Response:", response.body);
            expect(response.body.details[0].message).toBe("Invalid email address");
        })

        it("should return an error for missing password", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    username: "testuser",
                    email: "testuser@example.com"
                })
                .expect(400);
            
            console.log("Login Response:", response.body);
            expect(response.body.details[0].message).toBe("Invalid input: expected string, received undefined");
        })

        it("should return an error for invalid register role", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "testuser",
                    email: "testuser@example.com",
                    password: "testUser",
                    role: "invalidrole"
                })
                .expect(400);
            
            console.log("Register Response:", response.body);
            expect(response.body.details[0].message).toBe("Invalid user role");
        })

        it("should return an error for invalid register email format", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "testuser",
                    email: "invalid-email",
                    password: "testUser",
                    role: "user"
                })
                .expect(400);
            
            console.log("Register Response:", response.body);
            expect(response.body.details[0].message).toBe("Invalid email address");
        })

        it("should return an error for invalid register password format", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "testuser",
                    email: "testuser@example.com",
                    password: "a",
                    role: "user" as const,
                    studentId: "2026-1234-ICP",
                    studentLRN: "123456789012",
                    studentStrand: "ICT" as const,
                    studentSection: "ICT-12-5"
                })
                .expect(400);
            
            console.log("Register Response:", response.body);
            expect(response.body.details[0].message).toBe("Password must be at least 6 characters long");
        })

        it("should return an error for invalid register username format", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "a",
                    email: "testuser@example.com",
                    password: "testUser",
                    role: "user" as const,
                    studentId: "2026-1234-ICP",
                    studentLRN: "123456789012",
                    studentStrand: "ICT" as const,
                    studentSection: "ICT-12-5"
                })
                .expect(400);
            
            console.log("Register Response:", response.body);
            expect(response.body.details[0].message).toBe("Username must be at least 3 characters long");
        })

        it("should return an error for invalid register student ID format", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "testuser",
                    email: "testuser@example.com",
                    password: "testUser",
                    role: "user" as const,
                    studentId: "isdf",
                    studentLRN: "123456789012",
                    studentStrand: "ICT" as const,
                    studentSection: "ICT-12-5"
                })
                .expect(400);
                
            console.log("Register Response:", response.body);
            expect(response.body.details[0].message).toBe("Student ID must be exactly 13 characters long");
        })

        it("should return an error for invalid register student LRN format", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "testuser",
                    email: "testuser@example.com",
                    password: "testUser",
                    role: "user" as const,
                    studentId: "2026-1234-ICP",
                    studentLRN: "i",
                    studentStrand: "ICT" as const,
                    studentSection: "ICT-12-5"
                })
                .expect(400);
                
            console.log("Register Response:", response.body);
            expect(response.body.details[0].message).toBe("Student LRN must be exactly 12 characters long");
        })

        it("should return an error for invalid register student strand format", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "testuser",
                    email: "testuser@example.com",
                    password: "testUser",
                    role: "user" as const,
                    studentId: "2026-1234-ICP",
                    studentLRN: "123456789012",
                    studentStrand: "invalid-strand" as const,
                    studentSection: "ICT-12-5"
                })
                .expect(400);
                
            console.log("Register Response:", response.body);
            expect(response.body.error).toBe("Validation failed");
            expect(response.body.details[0].message).toBe("Invalid student strand");
        })

        it("should return an error for duplicate email", async () => {
            const { testUser } = await createTestUser();
            
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "testuser2",
                    email: testUser.email,
                    password: "testUser2",
                    role: "user" as const,
                    studentId: "2026-1234-ICP",
                    studentLRN: "123456789013",
                    studentStrand: "ICT" as const,
                    studentSection: "ICT-12-5"
                })
                .expect(500);
            
            console.log("Register Response:", response.body);
            expect(response.body).toHaveProperty("message", "Internal server error");
        })

        it("should return an error for duplicate student ID", async () => {
            const { testUser } = await createTestUser();
            
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "testuser2",
                    email: "testuser2@example.com",
                    password: "testUser2",
                    role: "user" as const,
                    studentId: testUser.studentId,
                    studentLRN: "123456789013",
                    studentStrand: "ICT" as const,
                    studentSection: "ICT-12-5"
                })
                .expect(500);
            
            console.log("Register Response:", response.body);
            expect(response.body).toHaveProperty("message", "Internal server error");
        })

        it("should return an error for duplicate student LRN", async () => {
            const { testUser } = await createTestUser();
            
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "testuser2",
                    email: "testuser2@example.com",
                    password: "testUser2",
                    role: "user" as const,
                    studentId: "2026-1234-ICP",
                    studentLRN: testUser.studentLRN,
                    studentStrand: "ICT" as const,
                    studentSection: "ICT-12-5"
                })
                .expect(500);
            
            console.log("Register Response:", response.body);
            expect(response.body).toHaveProperty("message", "Internal server error");
        })
    })
})