// Updated schema to use MySQL for ContentCraftHub
import { mysqlTable, varchar, text, int, datetime, mysqlEnum } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define categories for the blog posts
export const categories = [
  "Technology",
  "Development",
  "Database",
  "Design",
  "Business",
] as const;

// Define statuses for the blog posts
export const statuses = [
  "published",
  "draft",
  "archived",
] as const;

// Define the posts table schema for MySQL
export const posts = mysqlTable("posts", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  status: mysqlEnum("status", statuses).default("published").notNull(),
  imageUrl: varchar("image_url", { length: 512 }),
  views: int("views").default(0).notNull(),
  createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Create a schema for inserting posts
export const insertPostSchema = createInsertSchema(posts)
  .omit({ id: true, views: true, createdAt: true, updatedAt: true })
  .extend({
    category: z.enum(categories),
    status: z.enum(statuses),
    // Make imageUrl optional
    imageUrl: z.string().optional(),
  });

// Create a schema for updating posts
export const updatePostSchema = insertPostSchema.partial();

// Type definitions
export type InsertPost = z.infer<typeof insertPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
export type Post = typeof posts.$inferSelect;
