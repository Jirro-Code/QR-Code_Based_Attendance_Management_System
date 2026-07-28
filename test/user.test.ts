import request from "supertest";
import app from "../src/server.ts";
import { clearDatabase, createMultipleUser } from "./setup/dbHelpers.ts";

describe("user controller tests", () => {
    afterEach(async () => {
        await clearDatabase();
    });
    
    describe("GET /api/users/all", () => {
        it("should return 200 and a list of users for admin", async () => {
            const { testAdminsToken } = await createMultipleUser();
            
            const response = await request(app)
                .get("/api/users/all")
                .set("Authorization", `Bearer ${testAdminsToken[0]}`)
                .expect(200);
            console.log("GET all users Response:", response.body);
        })
    })
    
    describe("GET /api/users/role/:role", () => {
        it("should return 200 and a list of users with the specified role for admin", async () => {
            const { testAdminsToken } = await createMultipleUser();
            
            const response = await request(app)
                .get("/api/users/role/user")
                .set("Authorization", `Bearer ${testAdminsToken[0]}`)
                .expect(200);
            console.log("GET all users by role of user Response:", response.body);
            
            const response2 = await request(app)
                .get("/api/users/role/admin")
                .set("Authorization", `Bearer ${testAdminsToken[0]}`)
                .expect(200);
            console.log("GET all users by role of admin Response:", response2.body);
        })
    })
    
    describe("GET /api/users/search", () => {
        it("should return 200 and a list of users matching the search term for admin", async () => {
            const { testUsers, testAdminsToken } = await createMultipleUser();
            
            const response = await request(app)
                .get(`/api/users/search?search=${testUsers[0]!.username}`)
                .set("Authorization", `Bearer ${testAdminsToken[0]}`)
                .expect(200);
            console.log("GET all users by search term Response:", response.body);
        })
    })
    
    describe("PUT /api/users/update/:id", () => {
        it("should return 200 and the updated user for admin", async () => {
            const { testUsers, testAdminsToken } = await createMultipleUser();
            
            const response = await request(app)
                .put(`/api/users/update/${testUsers[2]!.id}`)
                .set("Authorization", `Bearer ${testAdminsToken[0]}`)
                .send({ username: "updateduser" })
                .expect(200);
            console.log("PUT update user Response:", response.body);
        })
    })
})