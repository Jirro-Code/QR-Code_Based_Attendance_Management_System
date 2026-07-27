import {createTestUser, createTestEvent, createTestAttendance, clearDatabase} from './dbHelpers.ts';

describe("Test Setup", async () => {
    let adminId: any;
    let userId: any;
    let testEventId: any;
    
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
    });
    
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