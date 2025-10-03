// Test script to verify admin login functionality
const testAdminLogin = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@aynbeauty.com",
        password: "admin123",
      }),
    });

    const data = await response.json();

    console.log("Admin Login Test Results:");
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (data.success && data.isAdmin) {
      console.log(
        "✅ Admin login successful - isAdmin flag is present and true"
      );
    } else if (data.success && !data.isAdmin) {
      console.log("❌ Login successful but isAdmin flag is false or missing");
    } else {
      console.log("❌ Admin login failed");
    }
  } catch (error) {
    console.error("Error testing admin login:", error);
  }
};

testAdminLogin();
