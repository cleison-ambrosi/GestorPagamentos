
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "@shared/schema";
import * as fs from 'fs';

// MySQL connection configuration with enhanced SSL options
const sslConfig = () => {
  if (fs.existsSync('./ca.pem')) {
    return {
      rejectUnauthorized: false,
      ca: fs.readFileSync('./ca.pem'),
      secureProtocol: 'TLSv1_2_method'
    };
  }
  return { rejectUnauthorized: false };
};

const mysqlConfig = {
  host: process.env.MYSQL_HOST || "mysql8free-gestor-f.aivencloud.com",
  port: parseInt(process.env.MYSQL_PORT || "18411"),
  user: process.env.MYSQL_USER || "avnadmin", 
  password: process.env.MYSQL_PASSWORD || "AVNS_mv1K1_d_Hr_ZbRKQWMs",
  database: process.env.MYSQL_DATABASE || "pagamentos",
  ssl: sslConfig(),
  connectTimeout: 30000,
  connectionLimit: 10,
  acquireTimeout: 30000,
  charset: 'utf8mb4'
};

console.log(`Attempting MySQL connection to: ${mysqlConfig.host}:${mysqlConfig.port}`);

// Create connection pool with error handling
const connection = mysql.createPool(mysqlConfig);

export const db = drizzle(connection, { schema, mode: 'default' });

// Global variable to track connection status
let isConnected = false;
let connectionError: string | null = null;

// Enhanced connection test
async function testConnection() {
  try {
    const conn = await connection.getConnection();
    await conn.execute('SELECT 1');
    console.log('MySQL connection established successfully');
    conn.release();
    isConnected = true;
    connectionError = null;
    return true;
  } catch (err: any) {
    isConnected = false;
    connectionError = err.message;
    console.error('MySQL connection failed:', err.message);
    
    if (err.code === 'ENOTFOUND') {
      console.log('');
      console.log('DNS Resolution Error - Possible solutions:');
      console.log('1. Check if the MySQL server hostname is correct');
      console.log('2. Verify network connectivity from this environment');
      console.log('3. Use a direct IP address instead of hostname');
      console.log('4. Configure custom DNS or use a VPN if required');
      console.log('');
      console.log('To use custom MySQL settings, set these environment variables:');
      console.log('  MYSQL_HOST=your-mysql-host');
      console.log('  MYSQL_PORT=your-mysql-port');
      console.log('  MYSQL_USER=your-username');
      console.log('  MYSQL_PASSWORD=your-password');
      console.log('  MYSQL_DATABASE=your-database');
    }
    return false;
  }
}

// Test connection on startup
testConnection();

// Export connection status for use in routes
export const getConnectionStatus = () => ({
  isConnected,
  error: connectionError,
  config: {
    host: mysqlConfig.host,
    port: mysqlConfig.port,
    database: mysqlConfig.database
  }
});
