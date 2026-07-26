import {createTestUser, createTestEvent, createTestAttendance, clearDatabase} from './dbHelpers.ts';

describe("Test Setup", () => {
    test("should create a test user and admin", async () => {
        const { testUser, userToken, testAdmin, adminToken, testUserPassword, testAdminPassword } = await createTestUser();
        console.log("Test User:", testUser);
        console.log("Test User Password:", testUserPassword);
        console.log("User Token:", userToken);
        console.log("Test Admin:", testAdmin);
        console.log("Test Admin Password:", testAdminPassword);
        console.log("Admin Token:", adminToken);
        
        expect(testUser).toBeDefined();
        expect(userToken).toBeDefined();
        expect(testAdmin).toBeDefined();
        expect(adminToken).toBeDefined();
        await clearDatabase();
    });
});