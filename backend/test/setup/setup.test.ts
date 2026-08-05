import {createTestUser, createMultipleUser, createTestEvent, createTestAttendance, clearDatabase} from './dbHelpers.ts';

describe("Test Setup", async () => {
    let adminId: string;
    let userId: string;
    let testEventId: string;
    
    test("should create a test user and admin", async () => {
        const { testUser, userToken, testAdmin, adminToken, testUserPassword, testAdminPassword } = await createTestUser();
        adminId = testAdmin.id;
        userId = testUser.id;
        
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
        expect(adminId).toBeDefined();
        expect(userId).toBeDefined();
    });
    
    test("Should create a multiple test users and admins", async () => {
        const { testUsers, testUsersToken, testAdmins, testAdminsToken } = await createMultipleUser({}, 3, 2);
        for (const user of testUsers) {
            console.log("Test User:", user);
        }
        for (const token of testUsersToken) {
            console.log("User Token:", token);
        }
        for (const admin of testAdmins) {
            console.log("Test Admin:", admin);
        }
        for (const token of testAdminsToken) {
            console.log("Admin Token:", token);
        }
        expect(testUsers.length).toBe(3);
        expect(testUsersToken).toBeDefined();
        expect(testAdmins.length).toBe(2);
        expect(testAdminsToken).toBeDefined();
    })
    
    test("Should create a test event", async () => {
        const { testEvent } = await createTestEvent({}, adminId );
        testEventId = testEvent.id;
        
        console.log("Test Event:", testEvent);
        expect(testEvent).toBeDefined();
    })
    
    test("Should create a test attendance", async () => {
        const { testAttendance } = await createTestAttendance({}, userId, testEventId);
        
        console.log("Test Attendance:", testAttendance);
        expect(testAttendance).toBeDefined();
    })
    
    await clearDatabase();
});