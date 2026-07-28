import { mysqlTable, varchar, text, timestamp, date, boolean, unique, mysqlEnum} from "drizzle-orm/mysql-core";
import {relations} from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";


export const userRoles = ["user", "admin"] as const;
export const userStrands = ["ICT", "HRCTO", "GAS", "HUMSS", "ABM", "STEM", "AAD"] as const;
export const userRoleSchema = z.enum(userRoles, "Invalid user role");
export const userStrandSchema = z.enum(userStrands, "Invalid student strand");


export const users = mysqlTable("users", {
    id: varchar("id", { length: 36 }).primaryKey(),
    username: varchar("username", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: mysqlEnum("role", userRoles).notNull(),
    studentId: varchar("student_id", { length: 13 }).unique(),
    studentLRN: varchar("student_LRN", { length: 12 }).unique(),
    studentStrand: mysqlEnum("student_strand", userStrands),
    studentSection: varchar("student_section", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});


export const events = mysqlTable("events", {
    id: varchar("id", { length: 36 }).primaryKey(),
    createdBy: varchar("created_by", { length: 36 }).references(() => users.id, {
        onDelete: "cascade",
    }).notNull(),
    eventName: varchar("event_name", { length: 255 }).notNull(),
    eventDescription: text("event_description"),
    eventLocation: varchar("event_location", { length: 255 }),
    eventDate: date("event_date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});


export const attendance = mysqlTable("attendance", {
    id: varchar("id", { length: 36 }).primaryKey(),
    eventId: varchar("event_id", { length: 36 }).references(() => events.id, {
        onDelete: "cascade"
    }).notNull(),
    userId: varchar("user_id", { length: 36 }).references(() => users.id, {
        onDelete: "cascade"
    }).notNull(),
    attendedAt: timestamp("attended_at").defaultNow().notNull(),
    isLate: boolean("is_late").notNull().default(false)
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

