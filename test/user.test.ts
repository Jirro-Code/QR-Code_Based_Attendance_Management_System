import request from "supertest";
import app from "../src/server.ts";
import { v4 as uuid } from "uuid";
import { createTestUser, clearDatabase, createMultipleUser } from "./setup/dbHelpers.ts";
import { hashPassword } from "../src/utils/password.ts";

describe("user controller tests", () => {
    afterEach(async () => {
        await clearDatabase();
    });
    
    describe("GET /api/users/all", () => {
        it("should return 200 and a list of users for admin", async () => {
            const { testUsers, testAdmins, testAdminsToken } = await createMultipleUser();
            console.log("Created test users:", testUsers);
            console.log("Created test admins:", testAdmins);
            
            const response = await request(app)
                .get("/api/users/all")
                .set("Authorization", `Bearer ${testAdminsToken[0]}`)
                .expect(200);
            console.log("GET all users Response:", response.body);
        })
    })
    
    describe("GET /api/users/role/:role", () => {
        it("should return 200 and a list of users with the specified role for admin", async () => {
            const { testUsers, testAdmins, testAdminsToken } = await createMultipleUser();
            console.log("Created test users:", testUsers);
            console.log("Created test admins:", testAdmins);
            
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
            const { testUsers, testAdmins, testAdminsToken } = await createMultipleUser();
            console.log("Created test users:", testUsers);
            console.log("Created test admins:", testAdmins);
            
            const response = await request(app)
                .get(`/api/users/search?search=${testUsers[0]!.username}`)
                .set("Authorization", `Bearer ${testAdminsToken[0]}`)
                .expect(200);
            console.log("GET all users by search term Response:", response.body);
        })
    })
})