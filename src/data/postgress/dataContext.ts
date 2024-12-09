import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const _dataContext = prisma;

export default _dataContext;