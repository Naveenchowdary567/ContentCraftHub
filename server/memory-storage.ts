import { type Post, type InsertPost, type UpdatePost } from "@shared/schema";

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

// In-memory implementation of Storage interface
export class MemoryStorage implements IStorage {
  private posts: Post[] = [];
  private nextId = 1;

  constructor() {
    // Seed database when storage is initialized
    this.seedInitialData();
    console.log('Memory storage initialized with sample data');
  }

  async getAllPosts(): Promise<Post[]> {
    return [...this.posts].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPostById(id: number): Promise<Post | undefined> {
    return this.posts.find(post => post.id === id);
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    return this.posts
      .filter(post => post.category === category)
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const now = new Date();
    const newPost: Post = {
      id: this.nextId++,
      title: insertPost.title,
      content: insertPost.content,
      category: insertPost.category,
      status: insertPost.status,
      imageUrl: insertPost.imageUrl || null,
      views: 0,
      createdAt: now,
      updatedAt: now
    };
    
    this.posts.push(newPost);
    return { ...newPost };
  }

  async updatePost(id: number, updatePost: UpdatePost): Promise<Post | undefined> {
    const postIndex = this.posts.findIndex(post => post.id === id);
    
    if (postIndex === -1) {
      return undefined;
    }
    
    const updatedPost: Post = {
      ...this.posts[postIndex],
      ...updatePost,
      updatedAt: new Date()
    };
    
    this.posts[postIndex] = updatedPost;
    return { ...updatedPost };
  }

  async deletePost(id: number): Promise<boolean> {
    const initialLength = this.posts.length;
    this.posts = this.posts.filter(post => post.id !== id);
    return this.posts.length !== initialLength;
  }

  async incrementViews(id: number): Promise<Post | undefined> {
    const post = this.posts.find(post => post.id === id);
    
    if (!post) {
      return undefined;
    }
    
    post.views += 1;
    post.updatedAt = new Date();
    
    return { ...post };
  }

  private seedInitialData(): void {
    const now = new Date();
    
    this.posts = [
      {
        id: this.nextId++,
        title: "Getting Started with Node.js",
        content: "Learn the basics of Node.js and how to build server-side applications with JavaScript. This guide covers installation, modules, and creating a simple web server.",
        category: "Technology",
        status: "published",
        imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        views: 125,
        createdAt: now,
        updatedAt: now
      },
      {
        id: this.nextId++,
        title: "Express.js Fundamentals",
        content: "Understanding Express.js, the most popular Node.js framework. Learn routing, middleware, templating engines, and best practices for building REST APIs.",
        category: "Development",
        status: "published",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        views: 382,
        createdAt: now,
        updatedAt: now
      },
      {
        id: this.nextId++,
        title: "Working with MySQL Databases",
        content: "Learn how to connect Node.js applications to MySQL databases using libraries like mysql2 and Drizzle ORM. Covers connection setup, queries, and best practices.",
        category: "Database",
        status: "published",
        imageUrl: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        views: 217,
        createdAt: now,
        updatedAt: now
      },
      {
        id: this.nextId++,
        title: "React Hooks Deep Dive",
        content: "Explore the power of React Hooks for functional components. This guide covers useState, useEffect, useContext, and custom hooks with practical examples.",
        category: "Development",
        status: "published",
        imageUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        views: 156,
        createdAt: now,
        updatedAt: now
      },
      {
        id: this.nextId++,
        title: "UX Design Principles",
        content: "Understanding the fundamentals of User Experience design. Learn about user research, wireframing, prototyping, and usability testing to create intuitive interfaces.",
        category: "Design",
        status: "published",
        imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        views: 98,
        createdAt: now,
        updatedAt: now
      }
    ];
  }
}

// Create a storage based on environment
const isReplit = !process.env.LOCALDEV;
let storage: IStorage;

if (isReplit) {
  console.log('Using MemoryStorage for Replit environment');
  storage = new MemoryStorage();
} else {
  // When in local environment, we'll use the DatabaseStorage imported from storage.ts
  // This will be handled in index.ts to avoid circular dependencies
  storage = (undefined as any); // Will be replaced in index.ts
}

export { storage };