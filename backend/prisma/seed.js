// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.task.upsert({
    where: { id: 1 },
    update: {},
    create: {
      text: 'Tarea de ejemplo para pruebas',
      completed: false,
      userId: 1
    },
  })
}
 
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
