import { pgTable, uuid, varchar, text, timestamp, date, boolean, unique, pgEnum} from "drizzle-orm/pg-core";
import { relations} from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

const roleEnum = ["user", "admin"] as const;
const userStrandEnum = ["ICT", "HRCTO", "GAS", "HUMSS", "ABM", "STEM", "AAD"] as const;

export const userRoles = pgEnum("role", roleEnum);
export const userStrands = pgEnum("student_strand", userStrandEnum);
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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
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
    attendance: many(attendance)
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
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;


export const insertUserSchema = createInsertSchema(users).omit({ 
    id: true, createdAt: true, updatedAt: true 
});
export const selectUserSchema = createSelectSchema(users);
export const insertEventSchema = createInsertSchema(events).omit({
    id: true, createdAt: true, updatedAt: true 
});
export const selectEventSchema = createSelectSchema(events);
export const insertAttendanceSchema = createInsertSchema(attendance).omit({
    id: true, attendedAt: true
});
export const selectAttendanceSchema = createSelectSchema(attendance);

