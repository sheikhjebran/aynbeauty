import mysql from 'mysql2/promise'

let connection: mysql.Connection | null = null

// Extract database name from DB_NAME if it's a connection string
function getDatabaseName(): string {
  let dbName = process.env.DB_NAME || "aynbeauty";

  if (dbName.includes("mysql://") || dbName.includes("@")) {
    const match = dbName.match(/\/([^?\/]+)(\?|$)/);
    if (match) {
      dbName = match[1];
    } else {
      dbName = "aynbeauty";
    }
  }

  return dbName;
}

export async function getConnection(): Promise<mysql.Connection> {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: getDatabaseName(),
      port: parseInt(process.env.DB_PORT || '3306'),
    })
  }
  
  return connection
}

export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const conn = await getConnection()
    const [rows] = await conn.execute(query, params)
    return rows as T[]
  } catch (error) {
    console.error('Database query error:', error)
    throw new Error('Database operation failed')
  }
}

export async function closeConnection(): Promise<void> {
  if (connection) {
    await connection.end()
    connection = null
  }
}