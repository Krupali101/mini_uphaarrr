require('dotenv/config');

const connectDB = require('./api/_lib/db');

async function testConnection() {
  try {
    await connectDB();
    console.log('MongoDB connected successfully.');
    process.exit(0);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
