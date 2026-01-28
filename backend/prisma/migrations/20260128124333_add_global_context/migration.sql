-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('active', 'archived');

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "status" "ConversationStatus" NOT NULL DEFAULT 'active';

-- CreateTable
CREATE TABLE "GlobalContext" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalContext_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GlobalContext_userId_idx" ON "GlobalContext"("userId");

-- CreateIndex
CREATE INDEX "GlobalContext_category_idx" ON "GlobalContext"("category");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalContext_userId_key_key" ON "GlobalContext"("userId", "key");

-- AddForeignKey
ALTER TABLE "GlobalContext" ADD CONSTRAINT "GlobalContext_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
