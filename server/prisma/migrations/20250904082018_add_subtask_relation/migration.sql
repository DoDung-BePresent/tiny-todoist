-- AlterTable
ALTER TABLE "public"."tasks" ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
