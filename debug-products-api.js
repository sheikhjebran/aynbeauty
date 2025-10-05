const mysql = require('mysql2/promise');

const dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'ayn',
  password: 'aynBeauty@123',
  database: 'aynbeauty',
  charset: 'utf8mb4',
};

async function testQuery() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('Testing basic product query...');
    
    // Test 1: Simple query without LIMIT
    const [products1] = await connection.execute(`
      SELECT p.id, p.name FROM products p LIMIT 2
    `);
    console.log('Test 1 - Simple query:', products1);
    
    // Test 2: Query with parameters
    const limit = 2;
    const offset = 0;
    const [products2] = await connection.execute(`
      SELECT p.id, p.name FROM products p LIMIT ? OFFSET ?
    `, [limit, offset]);
    console.log('Test 2 - With parameters:', products2);
    
    // Test 3: Complex query like in API
    const [products3] = await connection.execute(`
      SELECT 
        p.id, p.name, p.description, p.price, p.discounted_price, p.stock_quantity,
        p.image_url, p.primary_image, p.is_trending, p.is_must_have, p.is_new_arrival,
        p.created_at, p.updated_at,
        c.name as category_name,
        c.slug as category_slug,
        COALESCE(b.name, 'Unknown') as brand,
        COALESCE(AVG(pr.rating), 0) as rating,
        COUNT(pr.id) as rating_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.is_approved = TRUE
      WHERE 1=1
       AND p.is_must_have = 1 
      GROUP BY p.id, p.name, p.description, p.price, p.discounted_price, p.stock_quantity, p.image_url, p.primary_image, p.is_trending, p.is_must_have, p.is_new_arrival, p.created_at, p.updated_at, c.name, c.slug, b.name 
      ORDER BY p.created_at DESC 
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    console.log('Test 3 - Complex query:', products3);
    
    await connection.end();
    console.log('All tests completed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testQuery();