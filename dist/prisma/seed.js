"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2 = require("argon2");
const prisma = new client_1.PrismaClient();
async function main() {
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
//# sourceMappingURL=seed.js.map