import { pgTable, uuid, varchar, text, timestamp, date, boolean, integer, unique, pgEnum, index} from "drizzle-orm/pg-core";
import { relations} from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

const roleEnum = ["user", "admin"] as const;
const userStrandEnum = ["ICT", "HRCTO", "GAS", "HUMSS", "ABM", "STEM", "AAD"] as const;

export const userRoles = pgEnum("role", roleEnum);
export const userStrands = pgEnum("student_strand", userStrandEnum);
export const securityAction = pgEnum("security_action", ["login", "change_password"]);
export const securityResult = pgEnum("security_result", ["success", "failure", "blocked"]);
export const userRoleSchema = z.enum(roleEnum, "Invalid user role");
export const userStrandSchema = z.enum(userStrandEnum, "Invalid student strand");


export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    profilePictureUrl: varchar("profile_picture_url", { length: 500 }).unique(),
    username: varchar("username", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: userRoles().notNull(),
    studentId: varchar("student_id", { length: 13 }).unique(),
    studentLRN: varchar("student_LRN", { length: 12 }).unique(),
    studentStrand: userStrands(),
    studentSection: varchar("student_section", { length: 255 }),
    isArchived: boolean("is_archived").notNull().default(false),
    otpAttempts: integer("otp_attempts").notNull().default(0),
    passwordChangeAttempts: integer("password_change_attempts").notNull().default(0),
    passwordChangeLockedUntil: timestamp("password_change_locked_until", { withTimezone: true }),
    passwordChangeLastAttemptAt: timestamp("password_change_last_attempt_at", { withTimezone: true }),
    loginFailedAttempts: integer("login_failed_attempts").notNull().default(0),
    loginLockedUntil: timestamp("login_locked_until", { withTimezone: true }),
    loginLastFailedAt: timestamp("login_last_failed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});


export const passwordResetOTP = pgTable("password_reset_otp", {
    id: uuid("id").primaryKey().defaultRandom(),
    userEmail: varchar("user_email", { length: 255 }).notNull().references(() => users.email, {
        onDelete: "cascade",
    }),
    tokenHash: varchar("token", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    resendAvailableAt: timestamp("resend_available_at", { withTimezone: true }),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const deviceRegistrations = pgTable("device_registrations", {
    id: uuid("id").primaryKey().defaultRandom(),
    deviceId: varchar("device_id", { length: 64 }).notNull().unique(),
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).defaultNow().notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow().notNull(),
    lastIpAddress: varchar("last_ip_address", { length: 255 }),
    userAgent: varchar("user_agent", { length: 500 }),
});

export const deviceRestrictions = pgTable("device_restrictions", {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: uuid("account_id").references(() => users.id, { onDelete: "cascade" }),
    deviceId: varchar("device_id", { length: 64 }).notNull().references(() => deviceRegistrations.deviceId, { onDelete: "cascade" }),
    reason: varchar("reason", { length: 100 }).notNull(),
    failedAttempts: integer("failed_attempts").notNull().default(0),
    escalationLevel: integer("escalation_level").notNull().default(0),
    restrictedUntil: timestamp("restricted_until", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
    unique("device_restrictions_account_device_unique").on(table.accountId, table.deviceId),
    index("device_restrictions_until_idx").on(table.restrictedUntil),
]);

export const securityAttempts = pgTable("security_attempts", {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: uuid("account_id").references(() => users.id, { onDelete: "set null" }),
    deviceId: varchar("device_id", { length: 64 }).notNull().references(() => deviceRegistrations.deviceId, { onDelete: "cascade" }),
    ipAddress: varchar("ip_address", { length: 255 }),
    action: securityAction("action").notNull(),
    result: securityResult("result").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
    index("security_attempts_device_created_idx").on(table.deviceId, table.createdAt),
    index("security_attempts_account_created_idx").on(table.accountId, table.createdAt),
]);


export const events = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdBy: uuid("created_by").references(() => users.id, {
        onDelete: "cascade",
    }).notNull(),
    eventName: varchar("event_name", { length: 255 }).notNull(),
    eventDescription: text("event_description"),
    eventLocation: varchar("event_location", { length: 255 }).notNull(),
    eventDate: date("event_date").notNull(),
    isArchived: boolean("is_archived").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});


export const attendance = pgTable("attendance", {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id").references(() => events.id, {
        onDelete: "cascade"
    }).notNull(),
    userId: uuid("user_id").references(() => users.id, {
        onDelete: "cascade"
    }).notNull(),
    attendedAt: timestamp("attended_at", { withTimezone: true }).defaultNow().notNull(),
    isLate: boolean("is_late").notNull().default(false),
    isArchivedByStudent: boolean("is_archived_by_student").notNull().default(false),
    isArchivedByEvent: boolean("is_archived_by_event").notNull().default(false),
    isArchived: boolean("is_archived").notNull().default(false),
    },
    (table) => [
        unique("attendance_user_event_unique").
        on(table.eventId, table.userId)
    ]
);


export const userRelations = relations(users, ({ many }) => ({
    events: many(events),
    attendance: many(attendance),
    passwordResetOTP: many(passwordResetOTP),
}));


export const passwordResetOTPRelations = relations(passwordResetOTP, ({ one }) => ({
    user: one(users, {
        fields: [passwordResetOTP.userEmail],
        references: [users.email],
    }),
}));


export const eventRelations = relations(events, ({ one, many }) => ({
    createdBy: one(users, {
        fields: [events.createdBy],
        references: [users.id],
    }),
    attendance: many(attendance),
}));


export const attendanceRelations = relations(attendance, ({ one }) => ({
    event: one(events, {
        fields: [attendance.eventId],
        references: [events.id],
    }),
    user: one(users, {
        fields: [attendance.userId],
        references: [users.id],
    }),
}));


export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PasswordResetToken = typeof passwordResetOTP.$inferSelect;
export type NewPasswordResetToken = typeof passwordResetOTP.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;


export const insertUserSchema = createInsertSchema(users).omit({ 
    id: true, createdAt: true, updatedAt: true 
});
export const selectUserSchema = createSelectSchema(users);
export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetOTP).omit({
    id: true, createdAt: true
});
export const selectPasswordResetTokenSchema = createSelectSchema(passwordResetOTP);
export const insertEventSchema = createInsertSchema(events).omit({
    id: true, createdAt: true, updatedAt: true 
});
export const selectEventSchema = createSelectSchema(events);
export const insertAttendanceSchema = createInsertSchema(attendance).omit({
    id: true, attendedAt: true
});
export const selectAttendanceSchema = createSelectSchema(attendance);
