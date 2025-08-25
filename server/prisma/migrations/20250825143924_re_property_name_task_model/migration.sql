/*
  Warnings:

  - You are about to drop the column `content` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."tasks" DROP COLUMN "content",
ADD COLUMN     "description" TEXT;
