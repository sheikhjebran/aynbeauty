import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aynbeauty',
  charset: 'utf8mb4',
  timezone: '+00:00',
  connectTimeout: 60000,
  // Removed invalid options: acquireTimeout, timeout
};

// Create connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

// Test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Execute query
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Get single record
export async function getOne(query: string, params: any[] = []) {
  const results = await executeQuery(query, params) as any[];
  return results[0] || null;
}

// Get multiple records
export async function getMany(query: string, params: any[] = []) {
  return await executeQuery(query, params) as any[];
}

// Insert record
export async function insert(table: string, data: Record<string, any>) {
  const columns = Object.keys(data).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const values = Object.values(data);
  
  const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
  const result = await executeQuery(query, values) as any;
  
  return {
    insertId: result.insertId,
    affectedRows: result.affectedRows
  };
}

// Update record
export async function update(table: string, data: Record<string, any>, where: string, whereParams: any[] = []) {
  const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(data), ...whereParams];
  
  const query = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
  const result = await executeQuery(query, values) as any;
  
  return {
    affectedRows: result.affectedRows,
    changedRows: result.changedRows
  };
}

// Delete record
export async function deleteRecord(table: string, where: string, whereParams: any[] = []) {
  const query = `DELETE FROM ${table} WHERE ${where}`;
  const result = await executeQuery(query, whereParams) as any;
  
  return {
    affectedRows: result.affectedRows
  };
}

export default pool;