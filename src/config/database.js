const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
});


const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

// Connection Logic
const connectDB = async () => {
  try {
    // We use $connect to verify the pool can actually reach the DB
    await prisma.$connect();
    console.log("🐘 Prisma 7 connected to PostgreSQL via Pool.");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

//Disconnection Logic
const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    await pool.end(); // Important! Also close the pg Pool
    console.log("🔌 Database connections closed.");
  } catch (error) {
    console.error("❌ Error during disconnection:", error.message);
  }
};

// Export the client and the helpers
module.exports = {
  prisma,
  connectDB,
  disconnectDB
};