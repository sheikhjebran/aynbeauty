const mysql = require("mysql2/promise");

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

async function addSampleProducts() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "aynbeauty",
  });

  try {
    // Clear existing products first
    await connection.execute("DELETE FROM products WHERE 1=1");

    // Add some sample products
    const products = [
      {
        name: "Vitamin C Serum",
        description: "Brightening vitamin C serum for radiant skin",
        price: 2499.0,
        stock_quantity: 45,
        category_id: 2, // Skincare
        image_url:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
        is_trending: true,
        is_must_have: false,
        is_new_arrival: false,
      },
      {
        name: "Matte Liquid Lipstick",
        description: "Long-lasting matte liquid lipstick in Rose Red",
        price: 1299.0,
        stock_quantity: 8,
        category_id: 1, // Makeup
        image_url:
          "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
        is_trending: false,
        is_must_have: true,
        is_new_arrival: false,
      },
      {
        name: "Hydrating Face Mask",
        description: "Deep hydrating sheet mask with hyaluronic acid",
        price: 399.0,
        stock_quantity: 120,
        category_id: 2, // Skincare
        image_url:
          "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400",
        is_trending: false,
        is_must_have: false,
        is_new_arrival: true,
      },
      {
        name: "Signature Perfume",
        description: "Elegant floral fragrance with notes of jasmine and rose",
        price: 4999.0,
        stock_quantity: 25,
        category_id: 3, // Fragrance
        image_url:
          "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
        is_trending: true,
        is_must_have: true,
        is_new_arrival: true,
      },
    ];

    for (const product of products) {
      const slug = createSlug(product.name);
      await connection.execute(
        `INSERT INTO products (name, slug, description, price, stock_quantity, category_id, image_url, is_trending, is_must_have, is_new_arrival, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          product.name,
          slug,
          product.description,
          product.price,
          product.stock_quantity,
          product.category_id,
          product.image_url,
          product.is_trending,
          product.is_must_have,
          product.is_new_arrival,
        ]
      );
    }

    console.log("Sample products added successfully");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await connection.end();
  }
}

addSampleProducts();
