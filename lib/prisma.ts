import { PrismaClient as PrismaMongoClient } from "@prisma/client";
import { PrismaClient as PrismaPostgresClient } from "@prisma/postgres-client";

const globalForPrismaMongo = global as unknown as { prisma?: PrismaMongoClient };
const globalForPrismaPostgres = global as unknown as { prisma?: PrismaPostgresClient };

export const prismaMongo =
  globalForPrismaMongo.prisma ??
  new PrismaMongoClient();

if (process.env.NODE_ENV !== "production") globalForPrismaMongo.prisma = prismaMongo;


// Postgres Client
export const prismaPostgres =
  globalForPrismaPostgres.prisma ??
  new PrismaPostgresClient();

if (process.env.NODE_ENV !== "production") globalForPrismaPostgres.prisma = prismaPostgres;
