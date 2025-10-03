// Debug admin login functionality
const testAdminLogin = async () => {
  try {
    console.log("Testing admin login...");

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

    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));

    if (data.success) {
      console.log("✅ Login successful");
      console.log("User role:", data.user?.role);
      console.log("Is Admin flag:", data.isAdmin);

      if (data.isAdmin) {
        console.log("✅ Admin flag is correctly set to true");
      } else {
        console.log("❌ Admin flag is missing or false");
      }
    } else {
      console.log("❌ Login failed:", data.error);
    }
  } catch (error) {
    console.error("Error testing admin login:", error.message);
  }
};

testAdminLogin();
