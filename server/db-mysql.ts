import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from '../shared/schema';

// Create a MySQL connection pool (configured for phpMyAdmin)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'contenthub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create a Drizzle ORM instance
export const db = drizzle(pool, { schema, mode: 'default' });

// Export the pool for direct queries if needed
export { pool };