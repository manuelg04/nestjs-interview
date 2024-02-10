/*
  Warnings:

  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `adminUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CUSTOMER');

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "adminUser";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
