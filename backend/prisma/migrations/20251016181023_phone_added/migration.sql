-- DropIndex
DROP INDEX "public"."User_name_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT;
