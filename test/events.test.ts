import request from "supertest";
import app from "../src/server.ts";
import { v4 as uuid } from "uuid";
import { clearDatabase, createTestUser, createTestEvent } from "./setup/dbHelpers.ts";

describe("event controller tests", () => {
    afterEach(async () => {
        await clearDatabase();
    });
    
    describe("GET /api/events/all", () => {
        it("should return 200 and a list of events for admin", async () => {
            const { adminToken } = await createTestUser();
            
            const response = await request(app)
                .get("/api/events/all")
                .set("Cookie", `token=${adminToken}`)
                .expect(200);
            
            console.log("GET all events Response:", response.body);
            expect(response.body).toHaveProperty("message", "Events retrieved successfully");
        })
    })
    
    describe("POST /api/events/create", () => {
        it("should return 201 and create an event for admin", async () => {          
            const { adminToken, testAdmin } = await createTestUser();            
            const {testEvent} = await createTestEvent({}, testAdmin.id);
            
            const response = await request(app)
                .post("/api/events/create")
                .set("Cookie", `token=${adminToken}`)
                .send(testEvent)
                .expect(201);
            
            console.log("POST create event Response:", response.body);
            expect(response.body).toHaveProperty("message", "Event created successfully");
        })
    })
    
    describe("GET /api/events/search", () => {
        it("should return 200 and matching events for admin", async () => {
            const { testAdmin, adminToken } = await createTestUser();
            const {testEvent} = await createTestEvent({}, testAdmin.id);
            
            const response = await request(app)
                .get(`/api/events/search?search=${testEvent.eventName}`)
                .set("Cookie", `token=${adminToken}`)
                .expect(200);
            
            console.log("GET search events Response:", response.body);
            expect(response.body).toHaveProperty("message", "Events retrieved successfully");
        })
    })
    
    describe("PUT /api/events/update/:id", () => {
        it("should return 200 and update an event for admin", async () => {
            const { testAdmin, adminToken } = await createTestUser();
            const {testEvent} = await createTestEvent({}, testAdmin.id);
            
            const response = await request(app)
                .put(`/api/events/update/${testEvent.id}`)
                .set("Cookie", `token=${adminToken}`)
                .send({ eventName: "Updated Event" })
                .expect(200);
            
            console.log("PUT update event Response:", response.body);
            expect(response.body).toHaveProperty("message", "Event updated successfully");
        })
    })
    
    describe("DELETE /api/events/delete/:id", () => {
        it("should return 200 and delete an event for admin", async () => {
            const { testAdmin, adminToken } = await createTestUser();
            const {testEvent} = await createTestEvent({}, testAdmin.id);
            
            const response = await request(app)
                .delete(`/api/events/delete/${testEvent.id}`)
                .set("Cookie", `token=${adminToken}`)
                .expect(200);
            
            console.log("DELETE event Response:", response.body);
            expect(response.body).toHaveProperty("message", "Event deleted successfully");
        })
    })
    
    describe("Error handling tests for events controller", () => {
        it("should return 401 when no token is provided", async () => {
            const response = await request(app)
                .get("/api/events/all")
                .expect(401); 
                
            console.log("GET all events Response:", response.body);
            expect(response.body).toHaveProperty("message", "No token provided");
        })
        
        it("should return 403 for a valid student token", async () => {
            const { userToken } = await createTestUser();
            
            const response = await request(app)
                .get("/api/events/all")
                .set("Cookie", `token=${userToken}`)
                .expect(403);
            
            console.log("GET all events Response:", response.body);
            expect(response.body).toHaveProperty("message", "Access denied. Admins only.");
        })
        
        it("should return 400 for missing required fields", async () => {
            const { adminToken } = await createTestUser();
            
            const response = await request(app)
                .post("/api/events/create")
                .set("Cookie", `token=${adminToken}`)
                .send({})
                .expect(400);
            
            console.log("POST create event Response:", response.body);
            expect(response.body).toHaveProperty("error", "Validation failed");
        })
        
        it("should return 400 for an invalid event date", async () => {
            const { adminToken } = await createTestUser();
            
            const response = await request(app)
                .post("/api/events/create")
                .set("Cookie", `token=${adminToken}`)
                .send({
                    eventName: "Past Event",
                    eventDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
                })
                .expect(400);
            
            console.log("POST create event Response:", response.body);
            expect(response.body).toHaveProperty("error", "Validation failed");
        }) 
        
        it("should return 400 when the search query is missing", async () => {
            const { adminToken } = await createTestUser();
            
            const response = await request(app)
                .get("/api/events/search")
                .set("Cookie", `token=${adminToken}`)
                .expect(400);
            
            console.log("GET search events Response:", response.body);
            expect(response.body).toHaveProperty("error", "Invalid query parameters");
        })
        
        it("should return 400 for an invalid event ID", async () => {
            const { adminToken } = await createTestUser();
            
            const response = await request(app)
                .put("/api/events/update/not-a-uuid")
                .set("Cookie", `token=${adminToken}`)
                .send({ eventName: "Updated Event" })
                .expect(400);
            
            console.log("PUT update event Response:", response.body);
            expect(response.body).toHaveProperty("error", "Invalid parameters");
        })
        
        it("should return 400 for an invalid request body", async () => {
            const { adminToken, testAdmin } = await createTestUser();
            const { testEvent } = await createTestEvent({}, testAdmin.id);
            
            const response = await request(app)
                .put(`/api/events/update/${testEvent.id}`)
                .set("Cookie", `token=${adminToken}`)
                .send({ eventName: "" })
                .expect(400);
            
            console.log("PUT update event Response:", response.body);
            expect(response.body).toHaveProperty("error", "Validation failed");
        })
        
        it("should return 404 for a non-existing event", async () => {
            const { adminToken } = await createTestUser();
            
            const response = await request(app)
                .put(`/api/events/update/${uuid()}`)
                .set("Cookie", `token=${adminToken}`)
                .send({ eventName: "Updated Event" })
                .expect(404);
            
            console.log("PUT update event Response:", response.body);
            expect(response.body).toHaveProperty("message", "Event not found");
        })
        
        it("should return 400 for an invalid event ID", async () => {
            const { adminToken } = await createTestUser();
            
            const response = await request(app)
                .delete("/api/events/delete/not-a-uuid")
                .set("Cookie", `token=${adminToken}`)
                .expect(400);
            
            console.log("DELETE event Response:", response.body);
            expect(response.body).toHaveProperty("error", "Invalid parameters");
        })
        
        it("should return 404 for a non-existing event", async () => {
            const { adminToken } = await createTestUser();
            
            const response = await request(app)
                .delete(`/api/events/delete/${uuid()}`)
                .set("Cookie", `token=${adminToken}`)
                .expect(404);
            
            console.log("DELETE event Response:", response.body);
            expect(response.body).toHaveProperty("message", "Event not found");
        })
    })
})