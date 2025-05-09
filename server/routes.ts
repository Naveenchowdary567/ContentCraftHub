import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { insertPostSchema, updatePostSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { IStorage } from "./storage";
import * as dbStorage from "./storage";
import * as memStorage from "./memory-storage";

// Select the appropriate storage implementation based on environment
const isReplit = !process.env.LOCALDEV;
// Use the memory storage for Replit environment, database storage for local
let storage: IStorage;

if (isReplit) {
  storage = memStorage.storage;
  console.log("Using in-memory storage for posts");
} else {
  storage = dbStorage.storage;
  console.log("Using database storage for posts");
}

// Set the storage in memory-storage.ts if we're in local environment
if (!isReplit && !memStorage.storage) {
  (memStorage as any).storage = dbStorage.storage;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - prefixed with /api
  const apiRouter = app.route('/api');

  // GET all posts
  app.get('/api/posts', async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getAllPosts();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Failed to fetch posts' });
    }
  });

  // GET post by id
  app.get('/api/posts/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid post ID' });
      }
      
      const post = await storage.getPostById(id);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      // Increment view count
      await storage.incrementViews(id);
      
      res.json(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ message: 'Failed to fetch post' });
    }
  });

  // GET posts by category
  app.get('/api/posts/category/:category', async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const posts = await storage.getPostsByCategory(category);
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      res.status(500).json({ message: 'Failed to fetch posts' });
    }
  });

  // POST create a new post
  app.post('/api/posts', async (req: Request, res: Response) => {
    try {
      const result = insertPostSchema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const post = await storage.createPost(result.data);
      res.status(201).json(post);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Failed to create post' });
    }
  });

  // PUT update a post
  app.put('/api/posts/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid post ID' });
      }
      
      const result = updatePostSchema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const updatedPost = await storage.updatePost(id, result.data);
      
      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      res.json(updatedPost);
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ message: 'Failed to update post' });
    }
  });

  // DELETE a post
  app.delete('/api/posts/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid post ID' });
      }
      
      const success = await storage.deletePost(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Failed to delete post' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
