import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function cleanDb() {
  // Важно: порядок удаления должен соответствовать связям (сначала удаляем зависимые таблицы)
  try {
    await prisma.refreshToken.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('База данных успешно очищена');
  } catch (error) {
    console.error('Ошибка при очистке базы данных:', error);
    throw error;
  }
} 