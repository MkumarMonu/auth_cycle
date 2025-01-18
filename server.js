// Import required modules
const express = require('express');
const authRoutes = require('./routes/auth');
const dbConnection = require('./db/dbConnect');
require('dotenv').config();

// Create Express app
const app = express();
app.use(express.json());

// Establish database connection
dbConnection();

// Routes
app.use('/api/auth', authRoutes);

// Error Middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Internal Server Error" } = err;
  console.error("Error:", err); // Log the full error for debugging
  res.status(statusCode).json({ message });
});

// Define the port
const PORT = process.env.PORT || 8000; // Fallback to 8000 if PORT is not set

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EACCES') {
    console.error(`Permission denied on port ${PORT}. Try running with elevated privileges.`);
  } else if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port.`);
  } else {
    console.error(`Error starting the server: ${err.message}`);
  }
});