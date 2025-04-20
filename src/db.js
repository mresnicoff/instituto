import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

prisma.$on('error', (e) => {
  console.error('Prisma Error:', e);
});

async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log('Conectado a la base de datos');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

async function disconnectFromDatabase() {
  await prisma.$disconnect();
}

export { prisma, connectToDatabase, disconnectFromDatabase };