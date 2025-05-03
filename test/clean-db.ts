import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function cleanDb() {
  await prisma.refreshToken.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});
} 