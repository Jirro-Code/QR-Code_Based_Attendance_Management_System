import { mysqlTable, varchar, text, timestamp, int, date} from "drizzle-orm/mysql-core";
import {relations} from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = mysqlTable("users", {
    id: varchar("id", { length: 36 }).primaryKey(),
    username: varchar("username", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    role: varchar("role", { length: 255 }).notNull(),
    student_id: varchar("student_id", { length: 255 }),
    student_LRN: int("student_LRN"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const events = mysqlTable("events", {
    id: varchar("id", { length: 36 }).primaryKey(),
    created_by: varchar("created_by", { length: 36 }).references(() => users.id).notNull(),
    event_name: varchar("event_name", { length: 255 }).notNull(),
    event_description: text("event_description"),
    event_date: date("event_date").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
    events: many(events)
}));

export const eventRelations = relations(events, ({ one }) => ({
    created_by: one(users, {
        fields: [events.created_by],
        references: [users.id],
    }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export const insertUserSchema = createInsertSchema(users).omit({ 
    id: true, created_at: true, updated_at: true 
});
export const selectUserSchema = createSelectSchema(users);
export const insertEventSchema = createInsertSchema(events).omit({
    id: true, created_at: true, updated_at: true 
});
export const selectEventSchema = createSelectSchema(events);

