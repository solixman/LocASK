import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.ANSWERS_DB_URL}`;

let prisma: any = null;

try {
  const { PrismaClient } = require('../generated/prisma');
  const adapter = new PrismaPg({ connectionString });
  prisma = new PrismaClient({ adapter });
} catch (error) {
  console.warn('Prisma client not available:', error?.message ?? error);
}

export { prisma };