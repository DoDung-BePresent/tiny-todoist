/*
  Warnings:

  - Changed the type of `type` on the `accounts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `provider` on the `accounts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."AccountType" AS ENUM ('oauth', 'credentials');

-- CreateEnum
CREATE TYPE "public"."Provider" AS ENUM ('github', 'credentials');

-- AlterTable
ALTER TABLE "public"."accounts" DROP COLUMN "type",
ADD COLUMN     "type" "public"."AccountType" NOT NULL,
DROP COLUMN "provider",
ADD COLUMN     "provider" "public"."Provider" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "public"."accounts"("provider", "providerAccountId");
