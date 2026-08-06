import request from "supertest";
import app from "../src/server.ts";
import { buildAdminLoginBody, buildAuthCookie, buildUserLoginBody, createTestUser, clearDatabase } from "./setup/dbHelpers.ts";


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
            expect(response.headers["set-cookie"]).toBeDefined();
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
            
            const response = await request(app)
                .post("/api/auth/login")
                .send(buildUserLoginBody(testUser.studentId!, testUserPassword))
                .expect(201);
            
            console.log("Login Response:", response.body);
            expect(response.body).toHaveProperty("token");
            expect(response.body).toHaveProperty("user");
            expect(response.headers["set-cookie"]).toBeDefined();
            expect(response.body.user).toMatchObject({
                username: testUser.username,
                email: testUser.email,
                role: testUser.role,
                studentId: testUser.studentId,
                studentLRN: testUser.studentLRN,
                studentStrand: testUser.studentStrand,
                studentSection: testUser.studentSection
            });
        });
        
        it("should return 201 and a token for valid admin credentials", async () => {
            const { testAdmin, testAdminPassword } = await createTestUser();
            
            const response = await request(app)
                .post("/api/auth/login")
                .send(buildAdminLoginBody(testAdmin.email, testAdminPassword))
                .expect(201);
            
            console.log("Login Response:", response.body);
            expect(response.body).toHaveProperty("token");
            expect(response.body).toHaveProperty("user");
            expect(response.headers["set-cookie"]).toBeDefined();
            expect(response.body.user).toMatchObject({
                username: testAdmin.username,
                email: testAdmin.email,
                role: testAdmin.role
            });
        });
        
        it("should clear the auth cookie on logout", async () => {
            const { testUser, testUserPassword } = await createTestUser();
            
            const loginResponse = await request(app)
                .post("/api/auth/login")
                .send({
                    role: "user",
                    studentId: testUser.studentId,
                    password: testUserPassword
                })
                .expect(201);
            
            const response = await request(app)
                .post("/api/auth/logout")
                .set("Cookie", loginResponse.headers["set-cookie"]?.[0] ?? buildAuthCookie(loginResponse.body.token))
                .expect(200);
            
            console.log("Logout Response:", response.body);
            expect(response.body).toHaveProperty("message", "Logout successful");
            expect(response.headers["set-cookie"]?.[0]).toContain("token=");
        });
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
                    role: "admin",
                    email: testAdmin.email,
                    password: "wrongpassword"
                })
                .expect(401);
            
            console.log("Login Response:", response.body);
            expect(response.body).toHaveProperty("message", "Invalid Credentials");
            
            const response2 = await request(app)
                .post("/api/auth/login")
                .send({
                    role: "user",
                    studentId: testUser.studentId,
                    password: "wrongpassword"
                })
                .expect(401);
            
            console.log("Login Response:", response2.body);
            expect(response2.body).toHaveProperty("message", "Invalid Credentials");
        })
        
        it("should return an error for non-existing admin", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    role: "admin",
                    email: "none@example.com",
                    password: "wrongpassword"
                })
                .expect(404);
            
            console.log("Login Response:", response.body);
            expect(response.body).toHaveProperty("message", "User not found");
        })
        
        it("should return an error for non-existing user", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    role: "user",
                    studentId: "2026-9999-ICP",
                    password: "wrongpassword"
                })
                .expect(404);
            
            console.log("Login Response:", response.body);
            expect(response.body).toHaveProperty("message", "User not found");
        })
        
        it("should return an error for invalid admin email format", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    role: "admin",
                    email: "invalid-email",
                    password: "wrongpassword"
                })
                .expect(400);
            
            console.log("Login Response:", response.body);
            expect(response.body.details[0].message).toBe("Invalid email address");
        })
        
        it("should return an error for invalid student ID format", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    role: "user",
                    studentId: "isdf",
                    password: "wrongpassword"
                })
                .expect(400);
            
            console.log("Login Response:", response.body);
            expect(response.body.details[0].message).toBe("Student ID must be exactly 13 characters long");
        })
        
        it("should return an error for invalid password format", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    role: "user",
                    studentId: "2026-1234-ICP",
                    password: "a"
                })
                .expect(400);
            
            console.log("Login Response:", response.body);
            expect(response.body.details[0].message).toBe("Password must be at least 6 characters long");
        })
        
        it("should return an error for missing student ID", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    role: "user",
                    password: "wrongpassword"
                })
                .expect(400);
            
            console.log("Login Response:", response.body);
            expect(response.body).toHaveProperty("error", "Validation failed");
        })
        
        it("should return an error for missing admin email", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    role: "admin",
                    password: "wrongpassword"
                })
                .expect(400);
            
            console.log("Login Response:", response.body);
            expect(response.body).toHaveProperty("error", "Validation failed");
        })
        
        it("should return an error for missing password", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    role: "user",
                    studentId: "2026-1234-ICP"
                })
                .expect(400);
            
            console.log("Login Response:", response.body);
            expect(response.body.details[0].message).toBe("Invalid input: expected string, received undefined");
        });
        
        it("should return an error for invalid login role", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    role: "invalidrole",
                    email: "testuser@example.com",
                    password: "testUser"
                })
                .expect(400);
            
            console.log("Login Response:", response.body);
            expect(response.body.details[0].message).toBe("Invalid discriminator value. Expected 'user' | 'admin'");
        });
        
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
                .expect(409);
            
            console.log("Register Response:", response.body);
            expect(response.body).toHaveProperty("message", "User already exists");
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