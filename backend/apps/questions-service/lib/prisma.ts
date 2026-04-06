import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.QUESTIONS_DB_URL}`;

let prisma: any = null;

try {
  // generated Prisma client may not exist in this repo, fallback to null
  const { PrismaClient } = require('../generated/prisma');
  const adapter = new PrismaPg({ connectionString });
  prisma = new PrismaClient({ adapter });
} catch (error) {
  console.warn('Prisma client not available:', error?.message ?? error);
}

export { prisma };