const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
 
async function main() {
  // 1. Primero aseguramos que el usuario exista
  const user = await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: {
      name: 'Usuario de Prueba',
      email: 'test@test.com',
      password: 'password123',
    },
  })

  // 2. Luego creamos la tarea conectándola a ese usuario
  await prisma.task.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      text: 'Tarea de ejemplo para pruebas',
      completed: false,
      userId: user.id, // Usamos el ID del usuario recién creado/encontrado
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
  