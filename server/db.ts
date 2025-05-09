import { sql } from 'drizzle-orm';
import * as schema from "../shared/schema";

// Determine if we're running in Replit or local environment
const isReplit = !process.env.LOCALDEV;

// Optional: In Replit, use a mock database
// In local XAMPP environment, use MySQL
let db: any;
let pool: any;

if (isReplit) {
  console.log('Running in Replit environment - using mock database');
  // Import will be handled in the else block for local environment
  db = { 
    select: () => ({
      from: () => ({
        where: () => [],
        orderBy: () => [],
        limit: () => []
      })
    }),
    insert: () => ({ 
      values: () => ({ insertId: 1 }) 
    }),
    update: () => ({ 
      set: () => ({ 
        where: () => {} 
      }) 
    }),
    delete: () => ({ 
      where: () => {} 
    })
  };
} else {
  try {
    console.log('Running in local environment - using MySQL');
    // Import MySQL modules - these are optional in Replit
    const mysql = require('mysql2/promise');
    const { drizzle } = require('drizzle-orm/mysql2');
    
    // Create a MySQL connection pool - No password for phpMyAdmin
    pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',  // Empty password since no password is needed as per phpMyAdmin
      database: 'contenthub',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    // Create a Drizzle ORM instance with the mode parameter
    db = drizzle(pool, { schema, mode: 'default' });
  } catch (error) {
    console.error('Failed to initialize MySQL connection:', error);
    // Fallback to mock DB if MySQL initialization fails
    db = { 
      select: () => ({
        from: () => ({
          where: () => [],
          orderBy: () => [],
          limit: () => []
        })
      }),
      insert: () => ({ 
        values: () => ({ insertId: 1 }) 
      }),
      update: () => ({ 
        set: () => ({ 
          where: () => {} 
        }) 
      }),
      delete: () => ({ 
        where: () => {} 
      })
    };
  }
}

// Export the database instance
export { db, pool, sql };