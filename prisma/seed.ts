import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // Создаём админа
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: await argon2.hash('admin123'),
      roles: ['admin'],
    },
  });

  // Обычный пользователь
  const user = await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      email: 'user@example.com',
      password: await argon2.hash('user123'),
      roles: ['user'],
    },
  });

  // Тестовый проект
  await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Demo Project',
      description: 'Seeded project',
      ownerId: user.id,
    },
  });

  console.log('Seed complete');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect()); 