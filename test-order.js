// Test script to debug order creation
const testOrderData = {
  shipping_address: {
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    address: "123 Main St",
    city: "Test City",
    state: "Test State",
    pincode: "12345",
  },
  billing_address: {
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    address: "123 Main St",
    city: "Test City",
    state: "Test State",
    pincode: "12345",
  },
  payment_method: "COD",
  payment_reference: null,
  items: [
    {
      product_id: 1,
      variant_id: null,
      quantity: 1,
    },
  ],
};

async function testOrderCreation() {
  try {
    const response = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer your-test-token-here",
      },
      body: JSON.stringify(testOrderData),
    });

    const result = await response.json();
    console.log("Response:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Log the test data
console.log("Test order data:");
console.log(JSON.stringify(testOrderData, null, 2));
