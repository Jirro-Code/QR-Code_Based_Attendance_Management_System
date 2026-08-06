import request from "supertest";
import app from "../src/server.ts";
import { v4 as uuid } from "uuid";
import { clearDatabase, createMultipleUser } from "./setup/dbHelpers.ts";

describe("user controller tests", () => {
    afterEach(async () => {
        await clearDatabase();
    });
    
    describe("GET /api/users/all", () => {
        it("should return 200 and a list of users for admin", async () => {
            const { testAdminsToken } = await createMultipleUser({}, 5, 5);
            
            const response = await request(app)
                .get("/api/users/all")
                .set("Cookie", `token=${testAdminsToken[0] ?? ""}`)
                .expect(200);
            
            console.log("GET all users Response:", response.body);
            expect(response.body).toHaveProperty("message", "Users retrieved successfully");
            expect(response.body.users).toHaveLength(10);
        })
    })
    
    describe("GET /api/users/role/:role", () => {
        it("should return 200 and a list of users with the specified role for admin", async () => {
            const { testAdminsToken } = await createMultipleUser({}, 5, 2);
            
            const response = await request(app)
                .get("/api/users/role/user")
                .set("Cookie", `token=${testAdminsToken[0] ?? ""}`)
                .expect(200);
            
            console.log("GET all users by role of user Response:", response.body);
            expect(response.body).toHaveProperty("message", "Users retrieved successfully");
            expect(response.body.users).toHaveLength(5);
            const response2 = await request(app)
                .get("/api/users/role/admin")
                .set("Cookie", `token=${testAdminsToken[0] ?? ""}`)
                .expect(200);
            
            console.log("GET all users by role of admin Response:", response2.body);
            expect(response2.body).toHaveProperty("message", "Users retrieved successfully");
            expect(response2.body.users).toHaveLength(2);
        })
    })
    
    describe("GET /api/users/search", () => {
        it("should return 200 and a list of users matching the search term for admin", async () => {
            const { testUsers, testAdminsToken } = await createMultipleUser({}, 3, 1);
            
            const response = await request(app)
                .get(`/api/users/search?search=${testUsers[0]!.username}`)
                .set("Cookie", `token=${testAdminsToken[0] ?? ""}`)
                .expect(200);
            
            console.log("GET all users by search term Response:", response.body);
            expect(response.body).toHaveProperty("message", "Users retrieved successfully");
        })
    })
    
    describe("PUT /api/users/update/:id", () => {
        it("should return 200 and the updated user for admin", async () => {
            const { testUsers, testAdminsToken } = await createMultipleUser({}, 3, 1);
            
            const response = await request(app)
                .put(`/api/users/update/${testUsers[2]!.id}`)
                .set("Cookie", `token=${testAdminsToken[0] ?? ""}`)
                .send({ username: "updateduser" })
                .expect(200);
            
            console.log("PUT update user Response:", response.body);
            expect(response.body).toHaveProperty("message", "User updated successfully");
        })
    })
    
    describe("DELETE /api/users/delete/:id", () => {
        it("should return 200 and delete the user for admin", async () => {
            const { testUsers, testAdminsToken } = await createMultipleUser({}, 3, 1);
            
            const response = await request(app)
                .delete(`/api/users/delete/${testUsers[0]!.id}`)
                .set("Cookie", `token=${testAdminsToken[0] ?? ""}`)
                .expect(200);
            
            console.log("DELETE user Response:", response.body);
            expect(response.body).toHaveProperty("message", "User deleted successfully");
        })
    })
    
    describe("Error handling tests for users controller", () => {
        it("should return 401 when no token is provided", async () => {
            const response = await request(app)
                .get("/api/users/all")
                .expect(401);
            
            console.log("GET all users Response:", response.body);
            expect(response.body).toHaveProperty("message", "No token provided");
        })
        
        it("should return 403 for a valid student token", async () => {
            const { testUsersToken } = await createMultipleUser({}, 3, 1);
            
            const response = await request(app)
                .get("/api/users/all")
                .set("Cookie", `token=${testUsersToken[0] ?? ""}`)
                .expect(403);
            
            console.log("GET all users Response:", response.body);
            expect(response.body).toHaveProperty("message", "Access denied. Admins only.");
        })
        
        it("should return 401 for a malformed token", async () => {
            const response = await request(app)
                .get("/api/users/all")
                .set("Cookie", "token=invalid.token.value")
                .expect(401);
            
            console.log("GET all users Response:", response.body);
            expect(response.body).toHaveProperty("message", "Invalid or expired token");
        })
        
        it("should return 400 for an invalid role parameter", async () => {
            const { testAdminsToken } = await createMultipleUser({}, 3, 1);
            
            const response = await request(app)
                .get("/api/users/role/not-a-role")
                .set("Cookie", `token=${testAdminsToken[0] ?? ""}`)
                .expect(400);
            
            console.log("GET users by invalid role Response:", response.body);
            expect(response.body).toHaveProperty("message", "Invalid role parameter");
        })
        
        it("should return 400 when the search query is missing", async () => {
            const { testAdminsToken } = await createMultipleUser({}, 3, 1);
            
            const response = await request(app)
                .get("/api/users/search")
                .set("Cookie", `token=${testAdminsToken[0] ?? ""}`)
                .expect(400);
            
            console.log("GET users by search Response:", response.body);
            expect(response.body).toHaveProperty("error", "Invalid query parameters");
        })
        
        it("should return 400 for an invalid user ID", async () => {
            const { testAdminsToken } = await createMultipleUser({}, 3, 1);
            
            const response = await request(app)
                .put("/api/users/update/not-a-uuid")
                .set("Cookie", `token=${testAdminsToken[0] ?? ""}`)
                .send({ username: "updateduser" })
                .expect(400);
            
            console.log("PUT update user Response:", response.body);
            expect(response.body).toHaveProperty("error", "Invalid parameters");
        })
        
        it("should return 400 for an invalid request body", async () => {
            const { testUsers, testAdminsToken } = await createMultipleUser({}, 3, 1);
            
            const response = await request(app)
                .put(`/api/users/update/${testUsers[0]!.id}`)
                .set("Cookie", `token=${testAdminsToken[0] ?? ""}`)
                .send({ email: "invalid-email" })
                .expect(400);
            
            console.log("PUT update user Response:", response.body);
            expect(response.body).toHaveProperty("error", "Validation failed");
        })
        
        it("should return 404 for a non-existing user", async () => {
            const { testAdminsToken } = await createMultipleUser({}, 3, 1);
            
            const response = await request(app)
                .put(`/api/users/update/${uuid()}`)
                .set("Cookie", `token=${testAdminsToken[0] ?? ""}`)
                .send({ username: "updateduser" })
                .expect(404);
            
            console.log("PUT update user Response:", response.body);
            expect(response.body).toHaveProperty("message", "User not found");
        })
        
        it("should return 400 for an invalid user ID when deleting", async () => {
            const { testAdminsToken } = await createMultipleUser({}, 3, 1);
            
            const response = await request(app)
                .delete("/api/users/delete/not-a-uuid")
                .set("Cookie", `token=${testAdminsToken[0] ?? ""}`)
                .expect(400);
            
            console.log("DELETE user Response:", response.body);
            expect(response.body).toHaveProperty("error", "Invalid parameters");
        })
        
        it("should return 404 for a non-existing user", async () => {
            const { testAdminsToken } = await createMultipleUser({}, 3, 1);
            
            const response = await request(app)
                .delete(`/api/users/delete/${uuid()}`)
                .set("Cookie", `token=${testAdminsToken[0] ?? ""}`)
                .expect(404);
            
            console.log("DELETE user Response:", response.body);
            expect(response.body).toHaveProperty("message", "User not found or unauthorized to delete");
        })
    })
})