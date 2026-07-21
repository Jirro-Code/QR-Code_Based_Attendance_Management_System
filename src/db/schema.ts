import { mysqlTable, varchar, text, timestamp, int, date} from "drizzle-orm/mysql-core";
import {relations} from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = mysqlTable("users", {
    id: varchar("id", { length: 36 }).primaryKey(),
    username: varchar("username", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: varchar("role", { length: 255 }).notNull(),
    studentId: varchar("student_id", { length: 13 }).unique(),
    studentLRN: varchar("student_LRN", { length: 12 }).unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const events = mysqlTable("events", {
    id: varchar("id", { length: 36 }).primaryKey(),
    createdBy: varchar("created_by", { length: 36 }).references(() => users.id).notNull(),
    eventName: varchar("event_name", { length: 255 }).notNull(),
    eventDescription: text("event_description"),
    eventDate: date("event_date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
    events: many(events)
}));

export const eventRelations = relations(events, ({ one }) => ({
    createdBy: one(users, {
        fields: [events.createdBy],
        references: [users.id],
    }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export const insertUserSchema = createInsertSchema(users).omit({ 
    id: true, createdAt: true, updatedAt: true 
});
export const selectUserSchema = createSelectSchema(users);
export const insertEventSchema = createInsertSchema(events).omit({
    id: true, createdAt: true, updatedAt: true 
});
export const selectEventSchema = createSelectSchema(events);

