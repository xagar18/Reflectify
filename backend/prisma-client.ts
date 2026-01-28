import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

// Get the connection string
const connectionString = process.env.DATABASE_URL!;

// Parse the connection string to remove conflicting SSL parameters
const url = new URL(connectionString);

// Remove SSL-related query parameters that might conflict
url.searchParams.delete('sslmode');
url.searchParams.delete('ssl');
url.searchParams.delete('sslaccept');
url.searchParams.delete('sslcert');
url.searchParams.delete('sslkey');
url.searchParams.delete('sslrootcert');

// Get the cleaned connection string
const cleanedConnectionString = url.toString();

// Create PostgreSQL connection pool with explicit SSL configuration
const pool = new Pool({
  connectionString: cleanedConnectionString,
  ssl: {
    rejectUnauthorized: false, // Accept self-signed certificates
  },
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Instantiate Prisma Client with adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
