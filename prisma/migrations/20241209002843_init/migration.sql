-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DEV_ROLE', 'ADMIN_ROLE', 'USER_ROLE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "img" VARCHAR(255),
    "role" "Role"[] DEFAULT ARRAY['USER_ROLE']::"Role"[],
    "IsMember" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
