import { PrismaClient } from "./generated/prisma"

// const globalForPrisma = global
// globalForPrisma.prisma = globalForPrisma.prisma || new PrismaClient()
// export const db = globalForPrisma.prisma


const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
})

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma
}

export const db = global.prisma || prisma


// export const db = globalThis.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   globalThis.prisma = db;
// }