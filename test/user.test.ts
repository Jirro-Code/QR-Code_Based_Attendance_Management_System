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
            console.log("GET /api/users/all Response:", response.body);
        })
    })
})