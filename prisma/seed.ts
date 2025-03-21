const { PrismaClient, BookingStatus } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.booking.deleteMany({})
  await prisma.field.deleteMany({})
  await prisma.user.deleteMany({})

  // Create test user
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'test@test.com',
      password: '$2a$10$GQH8JBQH8JBQH8JBQH8JBuH8JBQH8JBQH8JBQH8JBQH8JBQH8', // password: password123
      role: 'user',
    },
  })

  // Create fields
  const fields = await Promise.all([
    prisma.field.create({
      data: {
        name: 'Field A',
        description: '08:00 - 10:00',
        price: 150000,
        priority: 1,
        isActive: true,
      },
    }),
    prisma.field.create({
      data: {
        name: 'Field B', 
        description: '10:00 - 12:00',
        price: 200000,
        priority: 2,
        isActive: true,
      },
    }),
    prisma.field.create({
      data: {
        name: 'Field C',
        description: '13:00 - 15:00',
        price: 175000,
        priority: 3,
        isActive: true,
      },
    }),
    prisma.field.create({
      data: {
        name: 'Field D',
        description: '15:00 - 17:00',
        price: 125000,
        priority: 4,
        isActive: true,
      },
    }),
    prisma.field.create({
      data: {
        name: 'Field E',
        description: '17:00 - 19:00',
        price: 225000,
        priority: 5,
        isActive: true,
      },
    }),
    prisma.field.create({
      data: {
        name: 'Field F',
        description: '19:00 - 21:00',
        price: 180000,
        priority: 6,
        isActive: true,
      },
    }),
  ])

  // Create some bookings
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Set booking times
  const morningStart = new Date(today)
  morningStart.setHours(9, 0, 0, 0)
  const morningEnd = new Date(today)
  morningEnd.setHours(11, 0, 0, 0)

  const eveningStart = new Date(today)
  eveningStart.setHours(19, 0, 0, 0)
  const eveningEnd = new Date(today)
  eveningEnd.setHours(21, 0, 0, 0)

  await Promise.all([
    prisma.booking.create({
      data: {
        fieldId: fields[0].id,
        email: 'test@test.com',
        phoneNumber: '081234567890',
        clubName: 'Test Club',
        userId: user.id,
        startTime: morningStart,
        endTime: morningEnd,
        status: BookingStatus.CONFIRMED,
        totalPrice: fields[0].price,
      },
    }),
    prisma.booking.create({
      data: {
        fieldId: fields[1].id,
        email: 'test@test.com',
        phoneNumber: '081234567890',
        clubName: 'Test Club',
        userId: user.id,
        startTime: eveningStart,
        endTime: eveningEnd,
        status: BookingStatus.PENDING,
        totalPrice: fields[1].price,
      },
    }),
  ])

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 