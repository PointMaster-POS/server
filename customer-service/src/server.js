const app = require("./app"); // Import the app
const PORT = process.env.PORT || 3004; // Get the port from environment variables or default to 3004

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
