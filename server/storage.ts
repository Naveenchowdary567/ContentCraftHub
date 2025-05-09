import { posts, type Post, type InsertPost, type UpdatePost } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Post CRUD operations
  getAllPosts(): Promise<Post[]>; 
  getPostById(id: number): Promise<Post | undefined>;
  getPostsByCategory(category: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: UpdatePost): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  incrementViews(id: number): Promise<Post | undefined>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Seed database when storage is initialized
    this.seedPostsIfEmpty().catch(err => {
      console.error("Error seeding database:", err);
    });
  }

  async getAllPosts(): Promise<Post[]> {
    const results = await db.select().from(posts).orderBy(desc(posts.createdAt));
    return results as Post[];
  }

  async getPostById(id: number): Promise<Post | undefined> {
    const results = await db.select().from(posts).where(eq(posts.id, id));
    if (results.length === 0) return undefined;
    return results[0] as Post;
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    const results = await db.select().from(posts).where(eq(posts.category, category)).orderBy(desc(posts.createdAt));
    return results as Post[];
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    try {
      // MySQL version - insert and then fetch the created record
      const result = await db.insert(posts).values({
        title: insertPost.title,
        content: insertPost.content, 
        category: insertPost.category,
        status: insertPost.status,
        imageUrl: insertPost.imageUrl || null
      });
      
      // For MySQL through mysql2 driver, we access insertId differently
      // @ts-ignore - we know this property exists
      const id = Number(result.insertId);
      
      const post = await this.getPostById(id);
      if (!post) {
        throw new Error(`Could not find created post with id ${id}`);
      }
      return post;
    } catch (error) {
      console.error("Error in createPost:", error);
      throw error;
    }
  }

  async updatePost(id: number, updatePost: UpdatePost): Promise<Post | undefined> {
    try {
      // MySQL version - update and then fetch the updated record
      await db
        .update(posts)
        .set({ ...updatePost, updatedAt: new Date() })
        .where(eq(posts.id, id));
      
      return this.getPostById(id);
    } catch (error) {
      console.error("Error in updatePost:", error);
      throw error;
    }
  }

  async deletePost(id: number): Promise<boolean> {
    try {
      // MySQL version - check if record exists before deleting
      const post = await this.getPostById(id);
      if (!post) return false;
      
      await db
        .delete(posts)
        .where(eq(posts.id, id));
      
      return true;
    } catch (error) {
      console.error("Error in deletePost:", error);
      throw error;
    }
  }

  async incrementViews(id: number): Promise<Post | undefined> {
    try {
      const post = await this.getPostById(id);
      
      if (!post) {
        return undefined;
      }
      
      // MySQL version - update views by incrementing the current value
      await db
        .update(posts)
        .set({ 
          views: sql`${posts.views} + 1`,
          updatedAt: new Date()
        })
        .where(eq(posts.id, id));
      
      return this.getPostById(id);
    } catch (error) {
      console.error("Error in incrementViews:", error);
      throw error;
    }
  }
  
  // Function to seed initial data if the database is empty
  private async seedPostsIfEmpty(): Promise<void> {
    try {
      const result = await db.select().from(posts).limit(1);
      
      if (result.length > 0) {
        console.log('Database already has posts, skipping seed');
        return;
      }
      
      console.log('Seeding database with initial posts...');
      const now = new Date();
      const samplePosts = [
        {
          title: "Getting Started with Node.js",
          content: "Learn the basics of Node.js and how to build server-side applications with JavaScript. This guide covers installation, modules, and creating a simple web server.",
          category: "Technology",
          status: "published",
          imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          views: 0,
          createdAt: now,
          updatedAt: now
        },
        {
          title: "Express.js Fundamentals",
          content: "Understanding Express.js, the most popular Node.js framework. Learn routing, middleware, templating engines, and best practices for building REST APIs.",
          category: "Development",
          status: "published",
          imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          views: 0,
          createdAt: now,
          updatedAt: now
        },
        {
          title: "Working with MySQL Databases",
          content: "Learn how to connect Node.js applications to MySQL databases using libraries like mysql2 and Drizzle ORM. Covers connection setup, queries, and best practices.",
          category: "Database",
          status: "published",
          imageUrl: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          views: 0,
          createdAt: now,
          updatedAt: now
        }
      ];
      
      // For each post, create a properly formatted object
      for (const post of samplePosts) {
        try {
          await db.insert(posts).values({
            title: post.title,
            content: post.content,
            category: post.category,
            status: post.status as any,
            imageUrl: post.imageUrl,
            views: post.views,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
          });
        } catch (error) {
          console.error(`Error inserting post "${post.title}":`, error);
        }
      }
      
      console.log('Database seeded with initial posts');
    } catch (error) {
      console.error('Error in seedPostsIfEmpty:', error);
      
      // If we're in a mock environment, this function can fail silently
      // since we're using mock data anyway
      if (!process.env.LOCALDEV) {
        console.log('Running in mock environment, ignoring seed error');
      }
    }
  }
}

// Export a new instance of the database storage
export const storage = new DatabaseStorage();
